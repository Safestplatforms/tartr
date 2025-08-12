import { useState } from 'react';
import { useActiveAccount, useSendTransaction } from 'thirdweb/react';
import { getContract, prepareContractCall } from 'thirdweb';
import { client } from '@/lib/thirdweb';
import { AAVE_CONFIG, SUPPORTED_ASSETS } from '@/lib/aave/config';
import { AAVE_POOL_ABI, ERC20_ABI } from '@/lib/aave/abis';
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

  const [repayState, setRepayState] = useState<TransactionState>({
    isLoading: false,
    error: null,
    txHash: null,
  });

  const [withdrawState, setWithdrawState] = useState<TransactionState>({
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

  // Helper function to get ERC20 contract
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

  // Supply (Deposit) function
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

      // For ETH, we would use WETH Gateway, but for simplicity in MVP, let's handle ERC20 tokens first
      if (assetSymbol === 'ETH') {
        toast.error('ETH deposits will be implemented with WETH Gateway');
        setSupplyState({ isLoading: false, error: 'ETH not supported yet', txHash: null });
        return;
      }

      // Step 1: Check and approve token if needed
      const tokenContract = getERC20Contract(asset.address);

      // For now, approve max amount to avoid repeated approvals
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

      // Step 2: Supply to Aave
      const supplyTx = prepareContractCall({
        contract: poolContract,
        method: "supply",
        params: [
          asset.address,      // asset
          amountBigInt,       // amount
          account.address,    // onBehalfOf
          0,                  // referralCode - uint16
        ],
      });

      // Execute transaction
      sendTransaction(supplyTx, {
        onSuccess: (result) => {
          setSupplyState({
            isLoading: false,
            error: null,
            txHash: result.transactionHash,
          });
          toast.success(`Successfully supplied ${amount} ${assetSymbol}`);
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
          BigInt(2),          // interestRateMode (2 = variable rate) - uint256
          0,                  // referralCode - uint16
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

      // First approve the token for repayment
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

      // Prepare repay transaction
      const repayTx = prepareContractCall({
        contract: poolContract,
        method: "repay",
        params: [
          asset.address,      // asset
          amountBigInt,       // amount (use max uint256 for full repayment)
          BigInt(2),          // interestRateMode (2 = variable rate) - uint256
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

  // Withdraw function
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

      // Prepare withdraw transaction
      const withdrawTx = prepareContractCall({
        contract: poolContract,
        method: "withdraw",
        params: [
          asset.address,      // asset
          amountBigInt,       // amount (use max uint256 for full withdrawal)
          account.address,    // to
        ],
      });

      // Execute transaction
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

  // Approve token function (helper for ERC20 approvals)
  const approveToken = async (tokenAddress: string, spenderAddress: string, amount: bigint): Promise<void> => {
    if (!account?.address) throw new Error('No account connected');

    const tokenContract = getERC20Contract(tokenAddress);
    
    const approveTx = prepareContractCall({
      contract: tokenContract,
      method: "approve",
      params: [spenderAddress, amount],
    });

    return new Promise((resolve, reject) => {
      sendTransaction(approveTx, {
        onSuccess: (result) => {
          toast.success('Token approval successful');
          resolve();
        },
        onError: (error) => {
          toast.error('Token approval failed');
          reject(error);
        },
      });
    });
  };

  return {
    // Transaction functions
    supply,
    borrow,
    repay,
    withdraw,
    approveToken,
    
    // Transaction states
    supplyState,
    borrowState,
    repayState,
    withdrawState,
    
    // Helper to check if any transaction is loading
    isAnyTransactionLoading: supplyState.isLoading || borrowState.isLoading || repayState.isLoading || withdrawState.isLoading,
  };
};