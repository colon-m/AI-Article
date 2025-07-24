import { Column, PrimaryGeneratedColumn, Entity, ManyToOne,JoinColumn, OneToMany, ManyToMany} from "typeorm";
import { User } from "./user";
import { Comment } from "./comment";
import { Tag } from "./tag"

@Entity('articles')
export class Article {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: "varchar", length: 255})
    title!: string;

    @Column({type: "varchar", length: 255})
    content!: string;

    @Column({type: "datetime"})
    create_time!: Date;

    @Column({type: "datetime"})
    update_time!: Date;

    @Column({type: "bit"})
    is_deleted!: number;

    @Column({type: "int"})
    view!: number;

    @ManyToOne(()=>User)
    @JoinColumn({ name: "user_id",referencedColumnName: "id" })
    user!:User

    @OneToMany(()=>Comment,(comment)=>comment.article)
    comments!:Comment[];

    @ManyToMany(()=>Tag,(tag)=>tag.articles,{cascade:true})
    tags!: Tag[]
}