import { Column, PrimaryGeneratedColumn, Entity, ManyToOne,JoinColumn} from "typeorm";
import { User } from "./user";

@Entity('user_auths')
export class UserAuth {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: "varchar", length: 255})
    identity_type!: string;

    @Column({type: "varchar", length: 255})
    identifier!: string;

    @Column({type: "varchar", length: 255})
    credential!: string;

    @ManyToOne(()=>User,{cascade: true})
    @JoinColumn({ name: "user_id",referencedColumnName: "id" })
    user!:User
}