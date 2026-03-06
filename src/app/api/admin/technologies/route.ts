import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db, COLLECTIONS } from "@/services/firebase";
import { Technology } from "@/types/api";

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json(
        { success: false, error: "Firebase not initialized" },
        { status: 500 },
      );
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
    console.error("[API/Admin/Technologies GET] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch technologies" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!db)
      return NextResponse.json(
        { success: false, error: "Firebase not initialized" },
        { status: 500 },
      );

    const body = await request.json();
    const techData: Omit<Technology, "_id"> = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    const docRef = await db.collection(COLLECTIONS.TECHNOLOGIES).add(techData);
    const doc = await docRef.get();

    revalidatePath("/api/technologies");
    revalidatePath("/About");
    return NextResponse.json(
      {
        success: true,
        data: { _id: doc.id, ...doc.data() },
        message: "Technology created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[API/Admin/Technologies POST] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create technology" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!db)
      return NextResponse.json(
        { success: false, error: "Firebase not initialized" },
        { status: 500 },
      );

    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 },
      );
    }

    const docRef = db.collection(COLLECTIONS.TECHNOLOGIES).doc(_id);
    await docRef.update({
      ...updateData,
      updatedAt: new Date().toISOString(),
    });

    const updatedDoc = await docRef.get();

    revalidatePath("/api/technologies");
    revalidatePath("/About");
    return NextResponse.json({
      success: true,
      data: { _id: updatedDoc.id, ...updatedDoc.data() },
      message: "Technology updated successfully",
    });
  } catch (error) {
    console.error("[API/Admin/Technologies PUT] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update technology" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!db)
      return NextResponse.json(
        { success: false, error: "Firebase not initialized" },
        { status: 500 },
      );

    const body = await request.json();
    const id = body.id || body._id;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 },
      );
    }

    await db.collection(COLLECTIONS.TECHNOLOGIES).doc(id).delete();

    revalidatePath("/api/technologies");
    revalidatePath("/About");
    return NextResponse.json({
      success: true,
      message: "Technology deleted successfully",
    });
  } catch (error) {
    console.error("[API/Admin/Technologies DELETE] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete technology" },
      { status: 500 },
    );
  }
}
