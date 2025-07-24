// db/entities/user.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("users")
export class User { // 添加extends BaseEntity（可选但常见）
    @PrimaryGeneratedColumn({ type: "int" }) // 显式指定类型
    readonly id!: number;

    @Column({ type: "varchar", length: 255 }) // 推荐显式指定
    nickname!: string;

    @Column({ type: "varchar", length: 255 })
    avatar!: string;

    @Column({ type: "varchar", length: 255 })
    job!: string;

    @Column({ type: "varchar", length: 255  }) // 使用text类型存储长文本
    introduce!: string;
}