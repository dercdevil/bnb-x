import { ethers } from "ethers";

export const validateWalletAddress = (address: string): boolean => {
  try {
    return ethers.isAddress(address);
  } catch {
    return false;
  }
};

export const sendBNB = async (toAddress: string, amount: string) => {
  try {
    if (!process.env.PRIVATE_KEY || !process.env.BSC_RPC_URL) {
      throw new Error("Missing environment variables for BNB transfer");
    }

    const provider = new ethers.JsonRpcProvider(process.env.BSC_RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const tx = await wallet.sendTransaction({
      to: toAddress,
      value: ethers.parseEther(amount),
    });

    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("Error sending BNB:", error);
    throw error;
  }
};
