import { NextResponse } from "next/server";
import { AdminAuthService } from "@/services/admin-auth.service";
import { auth } from "@/config/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const settings = await AdminAuthService.getSettings();

    // Разрешаем установку, если она еще не была сделана, ИЛИ если пользователь уже авторизован
    if (settings?.isSetup && !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { password, question, answer } = await request.json();

    if (!password || !question || !answer) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const success = await AdminAuthService.updateSettings({
      passwordHash: password,
      securityQuestion: question,
      securityAnswerHash: answer,
    });

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Failed to update settings" },
        { status: 500 },
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
