import { ApiProperty } from '@nestjs/swagger'
import { Equals, IsEnum, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator'

export enum ContactMethodEnum {
    TELEGRAM = 'telegram',
    WHATSAPP = 'whatsapp',
    PHONE = 'phone',
    EMAIL = 'email',
    VK = 'vk',
    MAX = 'max'
}

export class CreateFeedbackDto {
    @ApiProperty({ example: 'Иван Петров', minLength: 2, maxLength: 120 })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(120)
    name!: string

    @ApiProperty({ example: '+7 989 214-50-80', maxLength: 500 })
    @IsString()
    @IsNotEmpty()
    contact!: string

    @ApiProperty({ enum: ContactMethodEnum, example: ContactMethodEnum.TELEGRAM })
    @IsEnum(ContactMethodEnum)
    method!: ContactMethodEnum

    @ApiProperty({ example: 'Нужны варианты размещения на 10 человек на 2 недели.', maxLength: 2000 })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(2000)
    comment!: string

    @ApiProperty({ example: true, description: 'Должно быть true' })
    @Equals(true, { message: 'consent must be accepted' })
    consent!: true
}
