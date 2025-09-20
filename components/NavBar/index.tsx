import navConfig from "./navconfig";
import Link from "next/link";
import styles from "./index.module.scss";
import { useRouter } from "next/router";
import { useState,useEffect } from "react";
import Login from "components/Login";
import { useStore } from "@/store";
import {Avatar,Dropdown,Menu} from "antd";
import {LogoutOutlined,HomeOutlined } from "@ant-design/icons";
import fetch from "service/fetch"
import { message } from "antd";
import {observer} from "mobx-react-lite";
import { useElement } from "hooks/useElement";


const NavBar = () => {
    const store = useStore()
    const user = store.userStore.userInfo
    const [isLogin, setIsLogin] = useState(false);
    const [ms, setMs] = useState<number[]>([]);
    const router = useRouter();
    const {elements,addElement} = useElement();
    useEffect(()=>{
        elements.current.map((item: HTMLDivElement)=>{
            setTimeout(()=>{
                item.classList.add(styles.initStatus)
            },Number(item.dataset.delay))
        })
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
    const menu = (
        <Menu>
            <Menu.Item>
                <HomeOutlined />
                &nbsp;<a onClick={handleGoSpace}>个人中心</a>
            </Menu.Item>
            <Menu.Item>
                <LogoutOutlined />
                &nbsp;<a onClick={hanldeLogout}>退出</a>
            </Menu.Item>
        </Menu>
    );
    useEffect(()=>{
        setMs(new Array(8).fill(0).map(()=>Math.random()*2000))
    },[])
    return (
        <div className={styles.nav}>
            <div ref={addElement} data-delay={ms[0]} className={styles.logo}>BLOG</div>
            <div className={styles.main}>
                {navConfig.map((item, index) => {
                    return (
                        <div ref={addElement} data-delay={1000*(index + 1)} className={styles.opacity} key={index}>
                            <Link href={item.path} className={`${styles.item} ${router.pathname === item.path ? styles.active : ''}`}>{item.title}</Link>
                        </div>
                    )
            })}
            </div>
            <div ref={addElement} data-delay={ms[8]} className={styles.right}>
                <button className={styles.btn} onClick={handleWrite}>写文章</button>
                {
                    user
                    ?
                    <Dropdown overlay={menu} placement="bottomLeft">
                        <Avatar size="large" src={user.avatar} />
                    </Dropdown>
                    :
                    <button className={styles.btn} onClick={() => setIsLogin(!isLogin)}>登录</button>
                }
            </div>
            <Login isLogin={isLogin} onClose={() => setIsLogin(false)} />
        </div>
    )
}

export default observer(NavBar);