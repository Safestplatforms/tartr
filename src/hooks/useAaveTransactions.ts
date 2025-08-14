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

  // Helper function to parse amount with decimals - returns bigint
  const parseAmount = (amount: number, decimals: number): bigint => {
    // Handle very small amounts and floating point precision
    const factor = Math.pow(10, decimals);
    const scaledAmount = Math.round(amount * factor);
    return BigInt(scaledAmount);
  };

  // Token approval helper
  const approveToken = async (tokenAddress: string, spenderAddress: string, amount: bigint) => {
    const tokenContract = getERC20Contract(tokenAddress);
    
    const approveTx = prepareContractCall({
      contract: tokenContract,
      method: "approve",
      params: [spenderAddress, amount],
    });

    return new Promise((resolve, reject) => {
      sendTransaction(approveTx, {
        onSuccess: (result) => {
          console.log('Token approved:', result.transactionHash);
          resolve(result);
        },
        onError: (error) => {
          console.error('Token approval failed:', error);
          reject(error);
        },
      });
    });
  };

  // Supply (Deposit) function - now supports ETH!
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

    setSupplyState({ isLoading: true, error: null, txHash: null });

    try {
      const amountBigInt = parseAmount(amount, asset.decimals);

      // Handle ETH deposits via WETH Gateway
      if (assetSymbol === 'ETH') {
        console.log(`Depositing ${amount} ETH via WETH Gateway...`);
        
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

        // Execute ETH deposit transaction
        sendTransaction(depositTx, {
          onSuccess: (result) => {
            setSupplyState({
              isLoading: false,
              error: null,
              txHash: result.transactionHash,
            });
            toast.success(`Successfully supplied ${amount} ETH to Tartr`);
          },
          onError: (error) => {
            console.error('ETH deposit failed:', error);
            setSupplyState({
              isLoading: false,
              error: error.message || 'ETH deposit failed',
              txHash: null,
            });
            toast.error('ETH deposit failed');
          },
        });

        return;
      }

      // Handle ERC20 token deposits (WBTC, etc.)
      console.log(`Depositing ${amount} ${assetSymbol}...`);

      // Step 1: Approve token spending
      const MAX_UINT256 = BigInt('115792089237316195423570985008687907853269984665640564039457584007913129639935');
      
      try {
        await approveToken(asset.address, AAVE_CONFIG.POOL, MAX_UINT256);
      } catch (approvalError) {
        console.error('Token approval failed:', approvalError);
        setSupplyState({ 
          isLoading: false, 
          error: 'Token approval failed', 
          txHash: null 
        });
        return;
      }

      // Step 2: Supply to Aave Pool
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

      // Execute supply transaction
      sendTransaction(supplyTx, {
        onSuccess: (result) => {
          setSupplyState({
            isLoading: false,
            error: null,
            txHash: result.transactionHash,
          });
          toast.success(`Successfully supplied ${amount} ${assetSymbol} to Tartr`);
        },
        onError: (error) => {
          console.error('Supply transaction failed:', error);
          setSupplyState({
            isLoading: false,
            error: error.message || 'Transaction failed',
            txHash: null,
          });
          toast.error('Supply transaction failed');
        },
      });

    } catch (error) {
      console.error('Supply error:', error);
      setSupplyState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        txHash: null,
      });
      toast.error('Failed to prepare supply transaction');
    }
  };

  // Borrow function
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
      const amountBigInt = parseAmount(amount, asset.decimals);

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

      // Execute transaction
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
          console.error('Borrow transaction failed:', error);
          setBorrowState({
            isLoading: false,
            error: error.message || 'Transaction failed',
            txHash: null,
          });
          toast.error('Borrow transaction failed');
        },
      });

    } catch (error) {
      console.error('Borrow error:', error);
      setBorrowState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        txHash: null,
      });
      toast.error('Failed to prepare borrow transaction');
    }
  };

  // Withdraw function - supports ETH via WETH Gateway
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
      const amountBigInt = parseAmount(amount, asset.decimals);

      // Handle ETH withdrawals via WETH Gateway
      if (assetSymbol === 'ETH') {
        const withdrawTx = prepareContractCall({
          contract: wethGatewayContract,
          method: "withdrawETH",
          params: [
            AAVE_CONFIG.POOL,   // pool
            amountBigInt,       // amount
            account.address,    // to
          ],
        });

        sendTransaction(withdrawTx, {
          onSuccess: (result) => {
            setWithdrawState({
              isLoading: false,
              error: null,
              txHash: result.transactionHash,
            });
            toast.success(`Successfully withdrew ${amount} ETH from Tartr`);
          },
          onError: (error) => {
            console.error('ETH withdrawal failed:', error);
            setWithdrawState({
              isLoading: false,
              error: error.message || 'ETH withdrawal failed',
              txHash: null,
            });
            toast.error('ETH withdrawal failed');
          },
        });

        return;
      }

      // Handle ERC20 withdrawals
      const withdrawTx = prepareContractCall({
        contract: poolContract,
        method: "withdraw",
        params: [
          asset.address,      // asset
          amountBigInt,       // amount
          account.address,    // to
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
          console.error('Withdraw transaction failed:', error);
          setWithdrawState({
            isLoading: false,
            error: error.message || 'Transaction failed',
            txHash: null,
          });
          toast.error('Withdraw transaction failed');
        },
      });

    } catch (error) {
      console.error('Withdraw error:', error);
      setWithdrawState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        txHash: null,
      });
      toast.error('Failed to prepare withdraw transaction');
    }
  };

  // Repay function
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
      const amountBigInt = parseAmount(amount, asset.decimals);

      // First approve the token for repayment (for ERC20 tokens)
      if (assetSymbol !== 'ETH') {
        const MAX_UINT256 = BigInt('115792089237316195423570985008687907853269984665640564039457584007913129639935');
        
        try {
          await approveToken(asset.address, AAVE_CONFIG.POOL, MAX_UINT256);
        } catch (approvalError) {
          console.error('Token approval failed:', approvalError);
          setRepayState({ 
            isLoading: false, 
            error: 'Token approval failed', 
            txHash: null 
          });
          return;
        }
      }

      // Prepare repay transaction
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

      // Execute transaction
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
          console.error('Repay transaction failed:', error);
          setRepayState({
            isLoading: false,
            error: error.message || 'Transaction failed',
            txHash: null,
          });
          toast.error('Repay transaction failed');
        },
      });

    } catch (error) {
      console.error('Repay error:', error);
      setRepayState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        txHash: null,
      });
      toast.error('Failed to prepare repay transaction');
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