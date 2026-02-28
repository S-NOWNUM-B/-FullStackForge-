import { NextResponse } from "next/server";
import { AdminAuthService } from "@/services/admin-auth.service";

export async function POST(request: Request) {
  try {
    const { answer, newPassword } = await request.json();

    if (!answer || !newPassword) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Проверяем ответ на секретный вопрос
    const isAnswerCorrect = await AdminAuthService.verifySecurityAnswer(answer);

    if (!isAnswerCorrect) {
      return NextResponse.json(
        { error: "Неверный ответ на секретный вопрос" },
        { status: 403 },
      );
    }

    // Если ответ верный, обновляем пароль
    const success = await AdminAuthService.updateSettings({
      passwordHash: newPassword, // Сервис сам захеширует
    });

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Ошибка при обновлении пароля" },
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
