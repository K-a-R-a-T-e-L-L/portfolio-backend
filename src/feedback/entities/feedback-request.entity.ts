import { ApiProperty } from '@nestjs/swagger'
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { ContactMethodEnum } from '../dto/create-feedback.dto'

@Entity({ name: 'feedback_requests' })
export class FeedbackRequestEntity {
    @ApiProperty({ example: 'd5d58f54-6bcc-4a80-b4f6-c63c70627f0c' })
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @ApiProperty({ example: 'Иван Петров' })
    @Column({ type: 'varchar', length: 120 })
    name!: string

    @ApiProperty({ example: '+7 989 214-50-80' })
    @Column({ type: 'text'})
    contact!: string

    @ApiProperty({ enum: ContactMethodEnum, example: ContactMethodEnum.TELEGRAM })
    @Column({ type: 'enum', enum: ContactMethodEnum })
    contactMethod!: ContactMethodEnum

    @ApiProperty({ example: 'Нужны варианты размещения на 10 человек на 2 недели.' })
    @Column({ type: 'text' })
    comment!: string

    @ApiProperty({ example: true })
    @Column({ type: 'boolean', default: true })
    consent!: boolean

    @ApiProperty({ example: '2026-04-01T18:12:59.001Z' })
    @CreateDateColumn({ type: 'timestamptz' })
    createdAt!: Date
}
