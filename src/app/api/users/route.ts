import { NextResponse } from "next/server";
import { FirebaseService } from "@/services/firebaseService";

const firebaseService = new FirebaseService();

export async function GET() {
  try {
    const users = await firebaseService.getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Error fetching users" },
      { status: 500 }
    );
  }
}
