import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import { Repository } from "typeorm";

import { ContactMethodEnum, CreateFeedbackDto } from "./dto/create-feedback.dto";
import { FeedbackRequestEntity } from "./entities/feedback-request.entity";

@Injectable()
export class FeedbackService {
  private readonly logger = new Logger(FeedbackService.name);

  constructor(
    @InjectRepository(FeedbackRequestEntity)
    private readonly feedbackRepository: Repository<FeedbackRequestEntity>,
    private readonly configService: ConfigService,
  ) {}

  async create(dto: CreateFeedbackDto, domain: string | null): Promise<FeedbackRequestEntity> {
    const request = await this.feedbackRepository.save({
      name: dto.name.trim(),
      contact: dto.contact.trim(),
      contactMethod: dto.method,
      comment: dto.comment.trim(),
      consent: dto.consent,
    });

    await this.sendToTelegram(request, domain);

    return request;
  }

  private async sendToTelegram(request: FeedbackRequestEntity, domain: string | null): Promise<void> {
    const botToken = this.configService.get<string>("TELEGRAM_BOT_TOKEN");
    const chatId = this.configService.get<string>("TELEGRAM_CHAT_ID");

    if (!botToken || !chatId) {
      this.logger.warn("Telegram credentials are not configured. Skipping notification.");
      return;
    }

    const contactLabelMap: Record<ContactMethodEnum, string> = {
      [ContactMethodEnum.PHONE]: "Звонок по телефону",
      [ContactMethodEnum.TELEGRAM]: "Telegram",
      [ContactMethodEnum.WHATSAPP]: "WhatsApp",
      [ContactMethodEnum.EMAIL]: "Email",
      [ContactMethodEnum.VK]: "VKontakte",
      [ContactMethodEnum.MAX]: "Max",
    };

    const date = new Date(request.createdAt);
    const formatted = date.toLocaleString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const message = `
📩 <b>Новая заявка обратной связи</b>
Домен: ${this.escapeHtml(domain ?? "—")}

👤 <b>Клиент:</b>
Имя: ${this.escapeHtml(request.name)}
Контакт: ${this.escapeHtml(request.contact)}
Метод связи: ${this.escapeHtml(contactLabelMap[request.contactMethod])}
Комментарий:\n<blockquote>${this.escapeHtml(request.comment)}</blockquote>

🆔 ID заявки: ${request.id}
📅 Дата: ${formatted}
`.trim();

    try {
      await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      });
    } catch (error) {
      this.logger.error("Failed to send feedback request to Telegram", error);
    }
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}
