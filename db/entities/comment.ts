import { Column, PrimaryGeneratedColumn, Entity, ManyToOne,JoinColumn} from "typeorm";
import { User } from "./user";
import { Article } from "./article";

@Entity('comments')
export class Comment {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    content!: string;

    @Column({type: "datetime"})
    create_time!: Date;

    @Column({type: "bit"})
    is_deleted!: number;

    @ManyToOne(()=>User)
    @JoinColumn({ name: "user_id",referencedColumnName: "id" })
    user!:User

    @ManyToOne(()=>Article)
    @JoinColumn({ name: "article_id",referencedColumnName: "id" })
    article!:Article
}