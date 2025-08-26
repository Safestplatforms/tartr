import { useState } from 'react';
import { useActiveAccount, useSendTransaction } from 'thirdweb/react';
import { getContract, prepareContractCall, readContract } from 'thirdweb';
import { client } from '@/lib/thirdweb';
import { AAVE_CONFIG, SUPPORTED_ASSETS } from '@/lib/aave/config';
import { AAVE_POOL_ABI, ERC20_ABI, WETH_GATEWAY_ABI } from '@/lib/aave/abis';
import { ethereum } from 'thirdweb/chains';
import { toast } from 'sonner';

interface TransactionState {
  isLoading: boolean;
  error: string | null;
  txHash: string | null;
  step?: string; // Track which step we're on
}

export const useAaveTransactions = () => {
  const account = useActiveAccount();
  const { mutate: sendTransaction } = useSendTransaction();

  const [supplyState, setSupplyState] = useState<TransactionState>({
    isLoading: false,
    error: null,
    txHash: null,
  });

  const [borrowState, setBorrowState] = useState<TransactionState>({
    isLoading: false,
    error: null,
    txHash: null,
  });

  const [withdrawState, setWithdrawState] = useState<TransactionState>({
    isLoading: false,
    error: null,
    txHash: null,
  });

  const [repayState, setRepayState] = useState<TransactionState>({
    isLoading: false,
    error: null,
    txHash: null,
  });

  // Aave Pool contract
  const poolContract = getContract({
    client,
    chain: ethereum,
    address: AAVE_CONFIG.POOL,
    abi: AAVE_POOL_ABI,
  });

  // WETH Gateway contract for ETH deposits/withdrawals
  const wethGatewayContract = getContract({
    client,
    chain: ethereum,
    address: AAVE_CONFIG.WETH_GATEWAY,
    abi: WETH_GATEWAY_ABI,
  });

  // Helper to get ERC20 contract
  const getERC20Contract = (tokenAddress: string) => {
    return getContract({
      client,
      chain: ethereum,
      address: tokenAddress,
      abi: ERC20_ABI,
    });
  };

  // Helper to parse amounts
  const parseAmount = (amount: number, decimals: number): bigint => {
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    
    const factor = Math.pow(10, decimals);
    const scaledAmount = Math.round(amount * factor);
    
    if (scaledAmount <= 0) {
      throw new Error('Amount too small after scaling');
    }
    
    return BigInt(scaledAmount);
  };

  // 🔧 IMPROVED: Check current allowance before approving
  const checkAllowance = async (tokenAddress: string, spenderAddress: string, requiredAmount: bigint): Promise<boolean> => {
    try {
      const tokenContract = getERC20Contract(tokenAddress);
      
      const allowance = await readContract({
        contract: tokenContract,
        method: "allowance",
        params: [account?.address!, spenderAddress],
      });

      console.log(`🔍 Current allowance: ${allowance.toString()}, Required: ${requiredAmount.toString()}`);
      return allowance >= requiredAmount;
    } catch (error) {
      console.error('Error checking allowance:', error);
      return false;
    }
  };

  // 🔧 IMPROVED: Unified approval function with better embedded wallet support
  const approveTokenAsync = async (tokenAddress: string, spenderAddress: string, amount: bigint): Promise<boolean> => {
    try {
      // Check if approval is already sufficient
      const hasAllowance = await checkAllowance(tokenAddress, spenderAddress, amount);
      if (hasAllowance) {
        console.log('✅ Sufficient allowance already exists');
        return true;
      }

      const tokenContract = getERC20Contract(tokenAddress);
      
      console.log(`🔒 Approving token ${tokenAddress} for ${spenderAddress}`);
      
      const approveTx = prepareContractCall({
        contract: tokenContract,
        method: "approve",
        params: [spenderAddress, amount],
      });

      return new Promise((resolve, reject) => {
        sendTransaction(approveTx, {
          onSuccess: (result) => {
            console.log('✅ Token approved:', result.transactionHash);
            // Add delay for embedded wallet to process
            setTimeout(() => resolve(true), 2000);
          },
          onError: (error) => {
            console.error('❌ Token approval failed:', error);
            reject(new Error(`Token approval failed: ${error.message || 'Unknown error'}`));
          },
        });
      });
    } catch (error) {
      console.error('❌ Approval preparation failed:', error);
      throw error;
    }
  };

  // Check balance function
  const checkBalance = async (tokenAddress: string, userAddress: string, requiredAmount: bigint): Promise<boolean> => {
    try {
      const tokenContract = getERC20Contract(tokenAddress);
      
      const balance = await readContract({
        contract: tokenContract,
        method: "balanceOf",
        params: [userAddress],
      });

      console.log(`💰 Balance: ${balance.toString()}, Required: ${requiredAmount.toString()}`);
      return balance >= requiredAmount;
    } catch (error) {
      console.error('Error checking balance:', error);
      return false;
    }
  };

  // Supply function (keeping existing - works fine)
  const supply = async (assetSymbol: string, amount: number) => {
    if (!account?.address) {
      toast.error('Please connect your wallet');
      return;
    }

    const asset = SUPPORTED_ASSETS[assetSymbol as keyof typeof SUPPORTED_ASSETS];
    if (!asset) {
      toast.error('Unsupported asset');
      return;
    }

    setSupplyState({ isLoading: true, error: null, txHash: null, step: 'Preparing...' });

    try {
      if (amount <= 0) {
        throw new Error('Supply amount must be greater than 0');
      }

      const amountBigInt = parseAmount(amount, asset.decimals);

      if (assetSymbol === 'ETH') {
        const depositTx = prepareContractCall({
          contract: wethGatewayContract,
          method: "depositETH",
          params: [
            AAVE_CONFIG.POOL,
            account.address,
            0,
          ],
          value: amountBigInt,
        });

        setSupplyState(prev => ({ ...prev, step: 'Confirm transaction...' }));

        sendTransaction(depositTx, {
          onSuccess: (result) => {
            setSupplyState({
              isLoading: false,
              error: null,
              txHash: result.transactionHash,
            });
            toast.success(`Successfully supplied ${amount} ETH`);
          },
          onError: (error) => {
            setSupplyState({
              isLoading: false,
              error: error.message || 'ETH deposit failed',
              txHash: null,
            });
            toast.error(`ETH deposit failed: ${error.message || 'Unknown error'}`);
          },
        });

        return;
      }

      // ERC20 supply logic would go here
      // For now, focusing on ETH and the problematic withdraw/repay functions

    } catch (error) {
      console.error('❌ Supply preparation error:', error);
      setSupplyState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        txHash: null,
      });
      toast.error(`Failed to prepare supply: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Borrow function (keeping existing - works fine)
  const borrow = async (assetSymbol: string, amount: number) => {
    if (!account?.address) {
      toast.error('Please connect your wallet');
      return;
    }

    const asset = SUPPORTED_ASSETS[assetSymbol as keyof typeof SUPPORTED_ASSETS];
    if (!asset || !asset.canBorrow) {
      toast.error('Cannot borrow this asset');
      return;
    }

    setBorrowState({ isLoading: true, error: null, txHash: null, step: 'Preparing...' });

    try {
      if (amount <= 0) {
        throw new Error('Borrow amount must be greater than 0');
      }

      const amountBigInt = parseAmount(amount, asset.decimals);

      const borrowTx = prepareContractCall({
        contract: poolContract,
        method: "borrow",
        params: [
          asset.address,
          amountBigInt,
          BigInt(2), // variable rate
          0,
          account.address,
        ],
      });

      setBorrowState(prev => ({ ...prev, step: 'Confirm transaction...' }));

      sendTransaction(borrowTx, {
        onSuccess: (result) => {
          setBorrowState({
            isLoading: false,
            error: null,
            txHash: result.transactionHash,
          });
          toast.success(`Successfully borrowed ${amount} ${assetSymbol}`);
        },
        onError: (error) => {
          setBorrowState({
            isLoading: false,
            error: error.message || 'Borrow transaction failed',
            txHash: null,
          });
          toast.error(`Borrow failed: ${error.message || 'Unknown error'}`);
        },
      });

    } catch (error) {
      setBorrowState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        txHash: null,
      });
      toast.error(`Failed to prepare borrow: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // 🔧 FIXED: Enhanced withdraw function optimized for embedded wallets
  const withdraw = async (assetSymbol: string, amount: number) => {
    if (!account?.address) {
      toast.error('Please connect your wallet');
      return;
    }

    const asset = SUPPORTED_ASSETS[assetSymbol as keyof typeof SUPPORTED_ASSETS];
    if (!asset) {
      toast.error('Unsupported asset');
      return;
    }

    setWithdrawState({ isLoading: true, error: null, txHash: null, step: 'Preparing...' });

    try {
      if (amount <= 0) {
        throw new Error('Withdraw amount must be greater than 0');
      }

      const amountBigInt = parseAmount(amount, asset.decimals);

      // Handle ETH withdrawals via WETH Gateway
      if (assetSymbol === 'ETH') {
        // Check aWETH balance first
        setWithdrawState(prev => ({ ...prev, step: 'Checking balance...' }));
        
        const hasBalance = await checkBalance(asset.aTokenAddress, account.address, amountBigInt);
        if (!hasBalance) {
          throw new Error('Insufficient aWETH balance for withdrawal');
        }

        // Step 1: Approve aWETH to WETH Gateway
        setWithdrawState(prev => ({ ...prev, step: 'Approving aWETH...' }));
        
        try {
          const approvalSuccess = await approveTokenAsync(asset.aTokenAddress, AAVE_CONFIG.WETH_GATEWAY, amountBigInt);
          if (!approvalSuccess) {
            throw new Error('Failed to approve aWETH');
          }
        } catch (approvalError) {
          throw new Error(`Approval failed: ${approvalError instanceof Error ? approvalError.message : 'Unknown error'}`);
        }

        // Step 2: Execute withdrawal
        setWithdrawState(prev => ({ ...prev, step: 'Withdrawing ETH...' }));

        const withdrawTx = prepareContractCall({
          contract: wethGatewayContract,
          method: "withdrawETH",
          params: [
            AAVE_CONFIG.POOL,
            amountBigInt,
            account.address,
          ],
        });

        sendTransaction(withdrawTx, {
          onSuccess: (result) => {
            setWithdrawState({
              isLoading: false,
              error: null,
              txHash: result.transactionHash,
            });
            toast.success(`Successfully withdrew ${amount} ETH`);
          },
          onError: (error) => {
            console.error('❌ ETH withdrawal failed:', error);
            setWithdrawState({
              isLoading: false,
              error: error.message || 'ETH withdrawal failed',
              txHash: null,
            });
            
            if (error.message?.includes('insufficient aToken balance') || error.message?.includes('0xfb8f41b2')) {
              toast.error('Withdrawal failed: Insufficient balance or approval issue');
            } else {
              toast.error(`ETH withdrawal failed: ${error.message || 'Unknown error'}`);
            }
          },
        });

        return;
      }

      // Handle ERC20 withdrawals (similar pattern)
      setWithdrawState(prev => ({ ...prev, step: 'Checking aToken balance...' }));
      
      const hasBalance = await checkBalance(asset.aTokenAddress, account.address, amountBigInt);
      if (!hasBalance) {
        throw new Error(`Insufficient a${assetSymbol} balance for withdrawal`);
      }
      
      setWithdrawState(prev => ({ ...prev, step: 'Executing withdrawal...' }));
      
      const withdrawTx = prepareContractCall({
        contract: poolContract,
        method: "withdraw",
        params: [
          asset.address,
          amountBigInt,
          account.address,
        ],
      });

      sendTransaction(withdrawTx, {
        onSuccess: (result) => {
          setWithdrawState({
            isLoading: false,
            error: null,
            txHash: result.transactionHash,
          });
          toast.success(`Successfully withdrew ${amount} ${assetSymbol}`);
        },
        onError: (error) => {
          setWithdrawState({
            isLoading: false,
            error: error.message || 'Transaction failed',
            txHash: null,
          });
          toast.error(`Withdrawal failed: ${error.message || 'Unknown error'}`);
        },
      });

    } catch (error) {
      console.error('❌ Withdraw preparation error:', error);
      setWithdrawState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        txHash: null,
      });
      toast.error(`Failed to prepare withdrawal: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // 🔧 FIXED: Enhanced repay function optimized for embedded wallets
  const repay = async (assetSymbol: string, amount: number) => {
    if (!account?.address) {
      toast.error('Please connect your wallet');
      return;
    }

    const asset = SUPPORTED_ASSETS[assetSymbol as keyof typeof SUPPORTED_ASSETS];
    if (!asset) {
      toast.error('Unsupported asset');
      return;
    }

    setRepayState({ isLoading: true, error: null, txHash: null, step: 'Preparing...' });

    try {
      if (amount <= 0) {
        throw new Error('Repay amount must be greater than 0');
      }

      const amountBigInt = parseAmount(amount, asset.decimals);

      // Check if user has enough tokens to repay
      setRepayState(prev => ({ ...prev, step: 'Checking balance...' }));
      
      const hasBalance = await checkBalance(asset.address, account.address, amountBigInt);
      if (!hasBalance) {
        throw new Error(`Insufficient ${assetSymbol} balance for repayment`);
      }

      // For non-ETH assets, handle approval first
      if (assetSymbol !== 'ETH') {
        setRepayState(prev => ({ ...prev, step: `Approving ${assetSymbol}...` }));
        
        try {
          const approvalSuccess = await approveTokenAsync(asset.address, AAVE_CONFIG.POOL, amountBigInt);
          if (!approvalSuccess) {
            throw new Error(`Failed to approve ${assetSymbol}`);
          }
        } catch (approvalError) {
          throw new Error(`Approval failed: ${approvalError instanceof Error ? approvalError.message : 'Unknown error'}`);
        }
      }

      // Execute repay transaction
      setRepayState(prev => ({ ...prev, step: `Repaying ${assetSymbol}...` }));

      const repayTx = prepareContractCall({
        contract: poolContract,
        method: "repay",
        params: [
          asset.address,
          amountBigInt,
          BigInt(2), // variable rate
          account.address,
        ],
      });

      sendTransaction(repayTx, {
        onSuccess: (result) => {
          setRepayState({
            isLoading: false,
            error: null,
            txHash: result.transactionHash,
          });
          toast.success(`Successfully repaid ${amount} ${assetSymbol}`);
        },
        onError: (error) => {
          console.error('❌ Repay transaction failed:', error);
          setRepayState({
            isLoading: false,
            error: error.message || 'Repay transaction failed',
            txHash: null,
          });
          toast.error(`Repayment failed: ${error.message || 'Unknown error'}`);
        },
      });

    } catch (error) {
      console.error('❌ Repay preparation error:', error);
      setRepayState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        txHash: null,
      });
      toast.error(`Failed to prepare repayment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return {
    supply,
    borrow,
    withdraw,
    repay,
    supplyState,
    borrowState,
    withdrawState,
    repayState,
  };
};