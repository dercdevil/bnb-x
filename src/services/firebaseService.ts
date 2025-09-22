import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  updateDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User, Campaign } from "@/types";

export class FirebaseService {
  private usersCollection = "users";
  private campaignCollection = "campaign";

  async addUser(userData: Omit<User, "id" | "createdAt">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.usersCollection), {
        ...userData,
        createdAt: new Date(),
        status: "pending",
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding user:", error);
      throw error;
    }
  }

  async getUserByWallet(walletAddress: string): Promise<User | null> {
    try {
      const q = query(
        collection(db, this.usersCollection),
        where("walletAddress", "==", walletAddress)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) return null;

      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as User;
    } catch (error) {
      console.error("Error getting user by wallet:", error);
      throw error;
    }
  }

  async getUserByTweetId(tweetId: string): Promise<User | null> {
    try {
      const q = query(
        collection(db, this.usersCollection),
        where("tweetId", "==", tweetId)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) return null;

      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as User;
    } catch (error) {
      console.error("Error getting user by tweet ID:", error);
      throw error;
    }
  }

  async updateUserStatus(
    userId: string,
    status: User["status"],
    txHash?: string
  ): Promise<void> {
    try {
      const userRef = doc(db, this.usersCollection, userId);
      const updateData: { status: User["status"]; txHash?: string } = {
        status,
      };
      if (txHash) updateData.txHash = txHash;

      await updateDoc(userRef, updateData);
    } catch (error) {
      console.error("Error updating user status:", error);
      throw error;
    }
  }

  async getRewardedUsersCount(): Promise<number> {
    try {
      const q = query(
        collection(db, this.usersCollection),
        where("status", "==", "rewarded")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error("Error getting rewarded users count:", error);
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const q = query(
        collection(db, this.usersCollection),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as User)
      );
    } catch (error) {
      console.error("Error getting all users:", error);
      throw error;
    }
  }

  async getCampaignInfo(): Promise<Campaign> {
    try {
      const campaignRef = doc(db, this.campaignCollection, "main");
      const campaignDoc = await getDoc(campaignRef);

      if (!campaignDoc.exists()) {
        // Create default campaign
        const defaultCampaign: Omit<Campaign, "id"> = {
          maxUsers: 5,
          currentUsers: 0,
          rewardAmount: "0.005",
          isActive: true,
          createdAt: new Date(),
        };

        await setDoc(campaignRef, defaultCampaign);
        return { id: "main", ...defaultCampaign };
      }

      return {
        id: campaignDoc.id,
        ...campaignDoc.data(),
      } as Campaign;
    } catch (error) {
      console.error("Error getting campaign info:", error);
      throw error;
    }
  }

  async updateCampaignUsers(increment: number = 1): Promise<void> {
    try {
      const campaignRef = doc(db, this.campaignCollection, "main");
      const campaignDoc = await getDoc(campaignRef);

      if (campaignDoc.exists()) {
        const currentUsers = campaignDoc.data().currentUsers || 0;
        await updateDoc(campaignRef, {
          currentUsers: currentUsers + increment,
        });
      }
    } catch (error) {
      console.error("Error updating campaign users:", error);
      throw error;
    }
  }
}
