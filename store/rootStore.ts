import { createUserStore,IuserStore } from "./userStore";
import { createViewedArticlesStore,IviewedArticlesStore } from "./viewArticlesStore";

export interface Istore{
    userStore: IuserStore,
    viewedArticlesStore: IviewedArticlesStore
}

export default function createStore(initValue: any): ()=>Istore {
    return ()=> {
        return {
            userStore:{...createUserStore(), ...initValue?.user},
            viewedArticlesStore:{...createViewedArticlesStore(), ...initValue?.viewedArticles},
        }
    }
} 