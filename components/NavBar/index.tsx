import {observer} from "mobx-react-lite";
import { useRouter } from "next/router";
import { useState,useEffect } from "react";

import { message } from "antd";

import { useStore } from "@/store";
import { useElement } from "hooks/useElement";
import fetch from "service/fetch";
import Login from "components/Login";
import Menu from "./Menu";
import RightSide from "./RightSide";
import Title from "./Title";
import styles from "./index.module.scss";

const NavBar = () => {
    const store = useStore()
    const user = store.userStore.userInfo;
    const [isLogin, setIsLogin] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [ms, setMs] = useState<number[]>([]);
    const router = useRouter();
    const {elements} = useElement();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
            
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    useEffect(()=>{
        // if(!elements.current) return;
        // elements.current.map((item: HTMLDivElement)=>{
        //     setTimeout(()=>{
        //         item.classList.add(styles.initStatus)
        //     },Number(item.dataset.delay))
        // });
        if(!elements.current) return;
            elements.current.map((item: HTMLDivElement)=>{
                item.classList.remove("bullet")
            })
        return () =>{
            
        }
    },[])

    const hanldeLogout = ()=>{
        fetch.post('api/user/logout').then((res:any)=>{
            if(res.code === 0){
                message.success('退出成功')
                store.userStore.userInfo = null
                store.viewedArticlesStore.modefyUser();
            }
        })
    }

    const handleGoSpace = ()=>{
        router.push(`/user/${user?.id}`)
    }

    const handleWrite = ()=>{
        if(user?.id){
            router.push('/editor/new')
        }else{
            message.warning("请先登录")
        }
    };

    const setLogin = () => {
        setIsLogin(pre => !pre);
    }

    useEffect(()=>{
        setMs(new Array(2).fill(0).map(()=>Math.random()*2000))
    },[]);
    
    return (
        <div className={styles.nav}>
            {isMobile
            ?
            <>
                <Menu isMobile={isMobile}/>
                <Title isMobile={isMobile} time={ms[0]}/>
                <RightSide
                    handleGoSpace={handleGoSpace}
                    hanldeLogout={hanldeLogout}
                    handleWrite={handleWrite}
                    setLogin={setLogin}
                    isMobile={isMobile}
                    time={ms[1]}
                />
            </>
            :
            <>
                <Title isMobile={isMobile} time={ms[0]}/>
                <Menu isMobile={isMobile}/>
                <RightSide
                    handleGoSpace={handleGoSpace}
                    hanldeLogout={hanldeLogout}
                    handleWrite={handleWrite}
                    setLogin={setLogin}
                    isMobile={isMobile}
                    time={ms[1]}
                />
            </>
            }
            <Login isLogin={isLogin} onClose={() => setIsLogin(false)} />
        </div>
    )
}

export default observer(NavBar);