import { db, COLLECTIONS } from "./firebase";
import bcryptjs from "bcryptjs";

export interface AdminSettings {
  passwordHash: string;
  securityQuestion: string;
  securityAnswerHash: string;
  isSetup: boolean;
}

export class AdminAuthService {
  private static readonly DOC_ID = "main_admin";

  /**
   * Получает настройки безопасности админа
   */
  static async getSettings(): Promise<AdminSettings | null> {
    try {
      if (!db) return null;
      const doc = await db
        .collection(COLLECTIONS.ADMIN_SETTINGS)
        .doc(this.DOC_ID)
        .get();
      if (!doc.exists) return null;
      return doc.data() as AdminSettings;
    } catch (error) {
      console.error("[AdminAuthService] Ошибка при получении настроек:", error);
      return null;
    }
  }

  /**
   * Проверяет пароль
   */
  static async verifyPassword(password: string): Promise<boolean> {
    const settings = await this.getSettings();
    if (!settings) {
      // Если настроек в БД нет, пробуем сравнить с ENV (для обратной совместимости)
      const envHash = process.env.ADMIN_PASSWORD_HASH;
      if (envHash) {
        return bcryptjs.compare(
          password,
          envHash.trim().replace(/^["']|["']$/g, ""),
        );
      }
      return false;
    }
    return bcryptjs.compare(password, settings.passwordHash);
  }

  /**
   * Проверяет секретный ответ
   */
  static async verifySecurityAnswer(answer: string): Promise<boolean> {
    const settings = await this.getSettings();
    if (!settings) return false;
    return bcryptjs.compare(
      answer.toLowerCase().trim(),
      settings.securityAnswerHash,
    );
  }

  /**
   * Сохраняет новые настройки (первичная настройка или сброс)
   */
  static async updateSettings(data: Partial<AdminSettings>): Promise<boolean> {
    try {
      if (!db) return false;

      const updateData: Record<string, unknown> = { ...data };

      // Если переданы открытые данные, хешируем их
      if (data.passwordHash && !data.passwordHash.startsWith("$2")) {
        updateData.passwordHash = await bcryptjs.hash(data.passwordHash, 10);
      }

      if (
        data.securityAnswerHash &&
        !data.securityAnswerHash.startsWith("$2")
      ) {
        updateData.securityAnswerHash = await bcryptjs.hash(
          data.securityAnswerHash.toLowerCase().trim(),
          10,
        );
      }

      await db
        .collection(COLLECTIONS.ADMIN_SETTINGS)
        .doc(this.DOC_ID)
        .set({ ...updateData, isSetup: true }, { merge: true });
      return true;
    } catch (error) {
      console.error(
        "[AdminAuthService] Ошибка при обновлении настроек:",
        error,
      );
      return false;
    }
  }
}
