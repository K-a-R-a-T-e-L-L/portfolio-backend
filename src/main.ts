import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'

import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    const configService = app.get(ConfigService)

    const normalizeOrigin = (origin: string) => origin.replace(/\/+$/, '')

    const corsOrigins = (configService.get<string>('CORS_ORIGIN') || '')
        .split(',')
        .map((origin) => normalizeOrigin(origin.trim()))
        .filter(Boolean)

    app.enableCors({
        origin: (requestOrigin, callback) => {
            if (!requestOrigin) {
                callback(null, true)
                return
            }

            const normalizedRequestOrigin = normalizeOrigin(requestOrigin)
            const isAllowed = corsOrigins.includes(normalizedRequestOrigin)

            callback(isAllowed ? null : new Error('Not allowed by CORS'), isAllowed)
        },
        credentials: true,
    })

    app.setGlobalPrefix('api')
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    )

    const swaggerConfig = new DocumentBuilder()
        .setTitle('AVAG Travel Backend')
        .setDescription('API for feedback form and Telegram notifications')
        .setVersion('1.0.0')
        .build()

    const document = SwaggerModule.createDocument(app, swaggerConfig)
    SwaggerModule.setup('api-docs', app, document, {
        jsonDocumentUrl: 'api-docs-json',
    })

    const port = configService.get<number>('PORT', 4000)
    await app.listen(port)
}

bootstrap()
