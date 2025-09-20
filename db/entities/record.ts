import { PrimaryGeneratedColumn, Entity, OneToOne, OneToMany,JoinColumn,} from "typeorm";
import { User } from "./user";
import { RecordArticle } from "./records_articles_rel";

@Entity('records')
export class Record {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(()=>User)
    @JoinColumn({ name: "user_id",referencedColumnName: "id" })
    user!:User

    @OneToMany(() => RecordArticle, (recordArticle) => recordArticle.record,{cascade:true})
    recordArticles!: RecordArticle[]; 
}