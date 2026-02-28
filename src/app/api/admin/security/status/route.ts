import { NextResponse } from "next/server";
import { AdminAuthService } from "@/services/admin-auth.service";

export async function GET() {
  try {
    const settings = await AdminAuthService.getSettings();
    return NextResponse.json({
      isSetup: !!settings?.isSetup,
      question: settings?.securityQuestion || null,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
