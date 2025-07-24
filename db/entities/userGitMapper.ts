import { Column, Entity, PrimaryGeneratedColumn,OneToOne,JoinColumn } from "typeorm";
import {User} from "./user";

@Entity("user_github_mapper")
export class UserGitMapper {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    github_id!:number;

    @OneToOne(()=>User)
    @JoinColumn({name:"user_id",referencedColumnName: "id" })
    user!: User;
}