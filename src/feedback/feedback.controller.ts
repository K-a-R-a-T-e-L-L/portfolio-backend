import { Body, Controller, HttpCode, HttpStatus, Post, Req } from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import type { Request } from "express";

import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { FeedbackRequestEntity } from "./entities/feedback-request.entity";
import { FeedbackService } from "./feedback.service";

@ApiTags("feedback")
@Controller("feedback")
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create website feedback request" })
  @ApiCreatedResponse({ type: FeedbackRequestEntity })
  create(@Body() dto: CreateFeedbackDto, @Req() req: Request) {
    const origin = req.headers.origin;
    const referer = req.headers.referer;
    const forwardedHost = req.headers["x-forwarded-host"];
    const host = Array.isArray(forwardedHost)
      ? forwardedHost[0]
      : forwardedHost ?? req.headers.host;

    const domain = this.resolveDomain(origin, referer, host ?? null);
    return this.feedbackService.create(dto, domain);
  }

  private resolveDomain(
    origin?: string | string[],
    referer?: string | string[],
    host?: string | null,
  ): string | null {
    const originValue = Array.isArray(origin) ? origin[0] : origin;
    const refererValue = Array.isArray(referer) ? referer[0] : referer;

    if (originValue) {
      try {
        return new URL(originValue).host;
      } catch {
        return originValue;
      }
    }

    if (refererValue) {
      try {
        return new URL(refererValue).host;
      } catch {
        return refererValue;
      }
    }

    return host ?? null;
  }
}
