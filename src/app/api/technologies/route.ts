import { NextResponse } from "next/server";
import { db, COLLECTIONS } from "@/services/firebase";
import { Technology } from "@/types/api";

export const revalidate = 3600; // Кэшируем на час, так как технологии меняются редко

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json({ success: true, data: [] });
    }

    const snapshot = await db
      .collection(COLLECTIONS.TECHNOLOGIES)
      .orderBy("order", "asc")
      .get();

    const technologies = snapshot.docs.map((doc) => ({
      _id: doc.id,
      ...doc.data(),
    })) as Technology[];

    return NextResponse.json({
      success: true,
      data: technologies,
    });
  } catch (error) {
    console.error("[API/Technologies GET] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch technologies" },
      { status: 500 },
    );
  }
}
