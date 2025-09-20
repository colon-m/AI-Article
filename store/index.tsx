import React,{createContext, ReactElement, useContext} from "react";
import {useLocalObservable,enableStaticRendering} from "mobx-react-lite"
import createStore,{ Istore } from "./rootStore";

interface Iprops{
    initValue: Record<any,any>,
    children: ReactElement
}

enableStaticRendering(!process.browser);

const StoreContext = createContext({});

export const StoreProvider = ({initValue,children}:Iprops) =>{
    const store: Istore = useLocalObservable(createStore(initValue));
    return (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = ()=>{
    const store: Istore = useContext(StoreContext) as Istore;
    if(!store){
        throw new Error('数据不存在')
    }
    return store
}
