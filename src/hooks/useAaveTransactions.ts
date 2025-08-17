import { useState } from 'react';
import { useActiveAccount, useSendTransaction } from 'thirdweb/react';
import { getContract, prepareContractCall } from 'thirdweb';
import { client } from '@/lib/thirdweb';
import { AAVE_CONFIG, SUPPORTED_ASSETS } from '@/lib/aave/config';
import { AAVE_POOL_ABI, ERC20_ABI, WETH_GATEWAY_ABI } from '@/lib/aave/abis';
import { ethereum } from 'thirdweb/chains';
import { toast } from 'sonner';

interface TransactionState {
  isLoading: boolean;
  error: string | null;
  txHash: string | null;
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

  // WETH Gateway contract for ETH deposits
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

  // 🔧 IMPROVED: Better amount parsing with validation
  const parseAmount = (amount: number, decimals: number): bigint => {
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    
    // Handle very small amounts and floating point precision
    const factor = Math.pow(10, decimals);
    const scaledAmount = Math.round(amount * factor);
    
    if (scaledAmount <= 0) {
      throw new Error('Amount too small after scaling');
    }
    
    return BigInt(scaledAmount);
  };

  // 🔧 IMPROVED: Better error handling for token approval
  const approveToken = async (tokenAddress: string, spenderAddress: string, amount: bigint) => {
    const tokenContract = getERC20Contract(tokenAddress);
    
    console.log(`🔑 Approving token ${tokenAddress} for ${spenderAddress}`);
    
    const approveTx = prepareContractCall({
      contract: tokenContract,
      method: "approve",
      params: [spenderAddress, amount],
    });

    return new Promise((resolve, reject) => {
      sendTransaction(approveTx, {
        onSuccess: (result) => {
          console.log('✅ Token approved:', result.transactionHash);
          resolve(result);
        },
        onError: (error) => {
          console.error('❌ Token approval failed:', error);
          reject(new Error(`Token approval failed: ${error.message || 'Unknown error'}`));
        },
      });
    });
  };

  // 🔧 IMPROVED: Enhanced supply function with better error handling
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

    if (!asset.isCollateral) {
      toast.error(`${assetSymbol} cannot be used as collateral`);
      return;
    }

    setSupplyState({ isLoading: true, error: null, txHash: null });

    try {
      // 🔧 IMPROVED: Better amount validation
      if (amount <= 0) {
        throw new Error('Supply amount must be greater than 0');
      }

      console.log(`🎯 Attempting to supply ${amount} ${assetSymbol}`);
      
      const amountBigInt = parseAmount(amount, asset.decimals);
      console.log(`🎯 Parsed amount: ${amountBigInt.toString()} (${asset.decimals} decimals)`);

      // Handle ETH deposits via WETH Gateway
      if (assetSymbol === 'ETH') {
        console.log(`⚡ Depositing ${amount} ETH via WETH Gateway...`);
        
        const depositTx = prepareContractCall({
          contract: wethGatewayContract,
          method: "depositETH",
          params: [
            AAVE_CONFIG.POOL,    // pool address
            account.address,     // onBehalfOf
            0,                   // referralCode
          ],
          value: amountBigInt,   // Send ETH as value
        });

        console.log('🎯 ETH deposit transaction prepared, sending to wallet...');

        // Execute ETH deposit transaction
        sendTransaction(depositTx, {
          onSuccess: (result) => {
            console.log('✅ ETH deposit successful:', result.transactionHash);
            setSupplyState({
              isLoading: false,
              error: null,
              txHash: result.transactionHash,
            });
            toast.success(`Successfully supplied ${amount} ETH to Tartr`);
          },
          onError: (error) => {
            console.error('❌ ETH deposit failed:', error);
            setSupplyState({
              isLoading: false,
              error: error.message || 'ETH deposit failed',
              txHash: null,
            });
            
            // 🔧 IMPROVED: More specific error messages
            if (error.message?.includes('insufficient funds')) {
              toast.error('Insufficient ETH balance');
            } else if (error.message?.includes('user rejected')) {
              toast.error('Transaction rejected by user');
            } else {
              toast.error(`ETH deposit failed: ${error.message || 'Unknown error'}`);
            }
          },
        });

        return;
      }

      // Handle ERC20 token deposits (WBTC, LINK, UNI, etc.)
      console.log(`🪙 Depositing ${amount} ${assetSymbol}...`);

      // Step 1: Approve token spending
      const MAX_UINT256 = BigInt('115792089237316195423570985008687907853269984665640564039457584007913129639935');
      
      try {
        await approveToken(asset.address, AAVE_CONFIG.POOL, MAX_UINT256);
      } catch (approvalError) {
        console.error('❌ Token approval failed:', approvalError);
        setSupplyState({ 
          isLoading: false, 
          error: 'Token approval failed', 
          txHash: null 
        });
        toast.error(`Failed to approve ${assetSymbol}: ${approvalError.message || 'Unknown error'}`);
        return;
      }

      // Step 2: Supply to Aave Pool
      console.log('🎯 Preparing supply transaction...');
      
      const supplyTx = prepareContractCall({
        contract: poolContract,
        method: "supply",
        params: [
          asset.address,      // asset
          amountBigInt,       // amount
          account.address,    // onBehalfOf
          0,                  // referralCode
        ],
      });

      console.log('🎯 Supply transaction prepared, sending to wallet...');

      // Execute supply transaction
      sendTransaction(supplyTx, {
        onSuccess: (result) => {
          console.log('✅ Supply transaction successful:', result.transactionHash);
          setSupplyState({
            isLoading: false,
            error: null,
            txHash: result.transactionHash,
          });
          toast.success(`Successfully supplied ${amount} ${assetSymbol} to Tartr`);
        },
        onError: (error) => {
          console.error('❌ Supply transaction failed:', error);
          setSupplyState({
            isLoading: false,
            error: error.message || 'Transaction failed',
            txHash: null,
          });
          
          // 🔧 IMPROVED: More specific error messages
          if (error.message?.includes('insufficient balance')) {
            toast.error(`Insufficient ${assetSymbol} balance`);
          } else if (error.message?.includes('user rejected')) {
            toast.error('Transaction rejected by user');
          } else {
            toast.error(`Supply failed: ${error.message || 'Unknown error'}`);
          }
        },
      });

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

  // 🔧 COMPLETELY IMPROVED: Enhanced borrow function
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

    setBorrowState({ isLoading: true, error: null, txHash: null });

    try {
      // 🔧 IMPROVED: Better amount validation
      if (amount <= 0) {
        throw new Error('Borrow amount must be greater than 0');
      }

      console.log(`🎯 Attempting to borrow ${amount} ${assetSymbol}`);
      
      let finalAmount = amount;
      let amountBigInt = parseAmount(amount, asset.decimals);
      
      console.log(`🎯 Parsed amount: ${amountBigInt.toString()} (${asset.decimals} decimals)`);

      // 🔧 IMPROVED: Minimum amount validation and auto-adjustment
      const minimumBorrowAmount = asset.decimals === 6 ? BigInt(1000000) : BigInt('1000000000000000000'); // $1 minimum
      
      if (amountBigInt < minimumBorrowAmount) {
        // Auto-adjust to minimum amount
        finalAmount = asset.decimals === 6 ? 1 : 1; // $1 minimum
        amountBigInt = parseAmount(finalAmount, asset.decimals);
        console.log(`⚠️ Amount too small, adjusting to ${finalAmount} ${assetSymbol}`);
        toast.info(`Minimum borrow amount is $1, adjusting to ${finalAmount} ${assetSymbol}`);
      }

      // 🔧 IMPROVED: Log transaction details for debugging
      console.log('🎯 Preparing borrow transaction:', {
        asset: asset.address,
        amount: amountBigInt.toString(),
        user: account.address,
        symbol: assetSymbol,
        finalAmount
      });

      // Prepare borrow transaction
      const borrowTx = prepareContractCall({
        contract: poolContract,
        method: "borrow",
        params: [
          asset.address,      // asset
          amountBigInt,       // amount
          BigInt(2),          // interestRateMode (2 = variable rate)
          0,                  // referralCode
          account.address,    // onBehalfOf
        ],
      });

      console.log('🎯 Borrow transaction prepared, sending to wallet...');

      // Execute transaction
      sendTransaction(borrowTx, {
        onSuccess: (result) => {
          console.log('✅ Borrow transaction successful:', result.transactionHash);
          setBorrowState({
            isLoading: false,
            error: null,
            txHash: result.transactionHash,
          });
          
          if (finalAmount !== amount) {
            toast.success(`Successfully borrowed ${finalAmount} ${assetSymbol} (minimum amount applied)`);
          } else {
            toast.success(`Successfully borrowed ${amount} ${assetSymbol}`);
          }
        },
        onError: (error) => {
          console.error('❌ Borrow transaction failed:', error);
          setBorrowState({
            isLoading: false,
            error: error.message || 'Transaction failed',
            txHash: null,
          });
          
          // 🔧 IMPROVED: More specific error messages
          if (error.message?.includes('insufficient collateral')) {
            toast.error('Insufficient collateral for this borrow amount');
          } else if (error.message?.includes('health factor')) {
            toast.error('Borrowing would make your position unhealthy');
          } else if (error.message?.includes('user rejected')) {
            toast.error('Transaction rejected by user');
          } else if (error.message?.includes('exceeds borrowing capacity')) {
            toast.error('Amount exceeds your borrowing capacity');
          } else {
            toast.error(`Borrow failed: ${error.message || 'Unknown error'}`);
          }
        },
      });

    } catch (error) {
      console.error('❌ Borrow preparation error:', error);
      setBorrowState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        txHash: null,
      });
      toast.error(`Failed to prepare borrow: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // 🔧 IMPROVED: Enhanced withdraw function
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

    setWithdrawState({ isLoading: true, error: null, txHash: null });

    try {
      if (amount <= 0) {
        throw new Error('Withdraw amount must be greater than 0');
      }

      console.log(`🎯 Attempting to withdraw ${amount} ${assetSymbol}`);
      
      const amountBigInt = parseAmount(amount, asset.decimals);
      console.log(`🎯 Parsed amount: ${amountBigInt.toString()} (${asset.decimals} decimals)`);

      // Handle ETH withdrawals via WETH Gateway
      if (assetSymbol === 'ETH') {
        console.log(`⚡ Withdrawing ${amount} ETH via WETH Gateway...`);
        
        const withdrawTx = prepareContractCall({
          contract: wethGatewayContract,
          method: "withdrawETH",
          params: [
            AAVE_CONFIG.POOL,   // pool
            amountBigInt,       // amount
            account.address,    // to
          ],
        });

        console.log('🎯 ETH withdrawal transaction prepared, sending to wallet...');

        sendTransaction(withdrawTx, {
          onSuccess: (result) => {
            console.log('✅ ETH withdrawal successful:', result.transactionHash);
            setWithdrawState({
              isLoading: false,
              error: null,
              txHash: result.transactionHash,
            });
            toast.success(`Successfully withdrew ${amount} ETH from Tartr`);
          },
          onError: (error) => {
            console.error('❌ ETH withdrawal failed:', error);
            setWithdrawState({
              isLoading: false,
              error: error.message || 'ETH withdrawal failed',
              txHash: null,
            });
            
            if (error.message?.includes('insufficient aToken balance')) {
              toast.error('Insufficient supplied ETH to withdraw');
            } else if (error.message?.includes('user rejected')) {
              toast.error('Transaction rejected by user');
            } else {
              toast.error(`ETH withdrawal failed: ${error.message || 'Unknown error'}`);
            }
          },
        });

        return;
      }

      // Handle ERC20 withdrawals
      console.log(`🪙 Withdrawing ${amount} ${assetSymbol}...`);
      
      const withdrawTx = prepareContractCall({
        contract: poolContract,
        method: "withdraw",
        params: [
          asset.address,      // asset
          amountBigInt,       // amount
          account.address,    // to
        ],
      });

      console.log('🎯 Withdrawal transaction prepared, sending to wallet...');

      sendTransaction(withdrawTx, {
        onSuccess: (result) => {
          console.log('✅ Withdrawal successful:', result.transactionHash);
          setWithdrawState({
            isLoading: false,
            error: null,
            txHash: result.transactionHash,
          });
          toast.success(`Successfully withdrew ${amount} ${assetSymbol}`);
        },
        onError: (error) => {
          console.error('❌ Withdraw transaction failed:', error);
          setWithdrawState({
            isLoading: false,
            error: error.message || 'Transaction failed',
            txHash: null,
          });
          
          if (error.message?.includes('insufficient aToken balance')) {
            toast.error(`Insufficient supplied ${assetSymbol} to withdraw`);
          } else if (error.message?.includes('user rejected')) {
            toast.error('Transaction rejected by user');
          } else {
            toast.error(`Withdrawal failed: ${error.message || 'Unknown error'}`);
          }
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

  // 🔧 IMPROVED: Enhanced repay function
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

    setRepayState({ isLoading: true, error: null, txHash: null });

    try {
      if (amount <= 0) {
        throw new Error('Repay amount must be greater than 0');
      }

      console.log(`🎯 Attempting to repay ${amount} ${assetSymbol}`);
      
      const amountBigInt = parseAmount(amount, asset.decimals);
      console.log(`🎯 Parsed amount: ${amountBigInt.toString()} (${asset.decimals} decimals)`);

      // First approve the token for repayment (for ERC20 tokens)
      if (assetSymbol !== 'ETH') {
        const MAX_UINT256 = BigInt('115792089237316195423570985008687907853269984665640564039457584007913129639935');
        
        try {
          await approveToken(asset.address, AAVE_CONFIG.POOL, MAX_UINT256);
        } catch (approvalError) {
          console.error('❌ Token approval failed:', approvalError);
          setRepayState({ 
            isLoading: false, 
            error: 'Token approval failed', 
            txHash: null 
          });
          toast.error(`Failed to approve ${assetSymbol} for repayment`);
          return;
        }
      }

      // Prepare repay transaction
      console.log('🎯 Preparing repay transaction...');
      
      const repayTx = prepareContractCall({
        contract: poolContract,
        method: "repay",
        params: [
          asset.address,      // asset
          amountBigInt,       // amount
          BigInt(2),          // interestRateMode (2 = variable rate)
          account.address,    // onBehalfOf
        ],
      });

      console.log('🎯 Repay transaction prepared, sending to wallet...');

      // Execute transaction
      sendTransaction(repayTx, {
        onSuccess: (result) => {
          console.log('✅ Repay transaction successful:', result.transactionHash);
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
            error: error.message || 'Transaction failed',
            txHash: null,
          });
          
          if (error.message?.includes('insufficient balance')) {
            toast.error(`Insufficient ${assetSymbol} balance for repayment`);
          } else if (error.message?.includes('user rejected')) {
            toast.error('Transaction rejected by user');
          } else {
            toast.error(`Repayment failed: ${error.message || 'Unknown error'}`);
          }
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