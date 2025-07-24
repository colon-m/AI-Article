import { createUseStore,IuserStore } from "./userStore";


export interface Istore{
    userStore: IuserStore
}
export default function createStore(initValue: any): ()=>Istore {
    return ()=> {
        return {
            userStore:{...createUseStore(), ...initValue?.user} 
        }
    }
} 