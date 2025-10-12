import { ethers } from "ethers";

export const validateWalletAddress = (address: string): boolean => {
  try {
    return ethers.isAddress(address);
  } catch {
    return false;
  }
};

// Contrato USDT en BSC
export const USDT_CONTRACT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955";

// ABI mínimo de ERC20 para transfer y balance
const USDT_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
];

export const sendUSDT = async (toAddress: string, amount: string) => {
  try {
    if (!process.env.PRIVATE_KEY || !process.env.BSC_RPC_URL) {
      throw new Error("Missing environment variables for USDT transfer");
    }

    const provider = new ethers.JsonRpcProvider(process.env.BSC_RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const usdtContract = new ethers.Contract(
      USDT_CONTRACT_ADDRESS,
      USDT_ABI,
      wallet
    );

    // USDT tiene 18 decimales en BSC
    const tx = await usdtContract.transfer(
      toAddress,
      ethers.parseUnits(amount, 18)
    );

    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("Error sending USDT:", error);
    throw error;
  }
};
