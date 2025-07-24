import navConfig from "./navconfig";
import Link from "next/link";
import styles from "./index.module.scss";
import { useRouter } from "next/router";
import { useState } from "react";
import Login from "components/Login";
import { useStore } from "@/store";
import {Avatar,Dropdown,Menu} from "antd";
import {LogoutOutlined,HomeOutlined } from "@ant-design/icons";
import fetch from "service/fetch"
import { message } from "antd";
import {observer} from "mobx-react-lite"


const NavBar = () => {
    const store = useStore()
    const user = store.userStore.userInfo
    const [isLogin, setIsLogin] = useState(false);
    const router = useRouter();
    const hanldeLogout = ()=>{
        fetch.post('api/user/logout').then((res:any)=>{
            if(res.code === 0){
                message.success('退出成功')
                store.userStore.userInfo = null
                console.log("store:",store)
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
    }
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

    return (
        <div className={styles.nav}>
            <section className={styles.logo}>BLOG</section>
            <div className={styles.main}>
                {navConfig.map((item, index) => {
                    return (
                        <section key={index}>
                            <Link href={item.path} className={`${styles.item} ${router.pathname === item.path ? styles.active : ''}`}>{item.title}</Link>
                        </section>
                    )
            })}
            </div>
            <section className={styles.right}>
                <button className={styles.btn} onClick={handleWrite}>写文章</button>
                {
                    user
                    ?
                    <Dropdown overlay={menu} placement="bottomLeft">
                        <Avatar src={user.avatar} />
                    </Dropdown>
                    :
                    <button className={styles.btn} onClick={() => setIsLogin(!isLogin)}>登录</button>
                }
            </section>
            <Login isLogin={isLogin} onClose={() => setIsLogin(false)} />
        </div>
    )
}

export default observer(NavBar);