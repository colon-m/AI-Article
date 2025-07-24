import { userInfo } from "os"

export type IuserInfo = {
    id: number,
    nickname: string,
    job: string,
    introduce: string,
    avatar: string
} | null

export interface IuserStore {
    userInfo: IuserInfo,
    setUserInfo: (value:IuserInfo)=>void 
}

export const createUseStore = ():IuserStore =>{
    return{
        userInfo: null,
        setUserInfo(value){
            this.userInfo = value
        }
    }
}