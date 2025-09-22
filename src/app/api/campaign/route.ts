import { NextResponse } from "next/server";
import { FirebaseService } from "@/services/firebaseService";

const firebaseService = new FirebaseService();

export async function GET() {
  try {
    const campaign = await firebaseService.getCampaignInfo();
    return NextResponse.json(campaign);
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return NextResponse.json(
      { error: "Error fetching campaign information" },
      { status: 500 }
    );
  }
}
