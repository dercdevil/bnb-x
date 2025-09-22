export interface User {
  id: string;
  walletAddress: string;
  tweetUrl: string;
  tweetId: string;
  tweetUsername?: string;
  txHash?: string;
  createdAt: Date;
  status: "pending" | "verified" | "rewarded" | "rejected";
}

export interface Campaign {
  id: string;
  maxUsers: number;
  currentUsers: number;
  rewardAmount: string;
  isActive: boolean;
  createdAt: Date;
}
