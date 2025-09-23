import {Avatar,Dropdown,Menu} from "antd";
import {LogoutOutlined,HomeOutlined,EditOutlined,LoginOutlined } from "@ant-design/icons";

import { useStore } from "@/store";
import { useElement } from "hooks/useElement";
import styles from "./index.module.scss"

type HeadProps ={
    handleGoSpace: ()=> void,
    hanldeLogout: () => void,
    handleWrite: () => void,
    setLogin: (a?:boolean) => void,
    isMobile?: boolean,
    time: number
}
const RightSide = ({handleGoSpace,hanldeLogout,handleWrite,setLogin,isMobile,time}:HeadProps)=>{
    const {addElement} = useElement();
    const store = useStore()
    const user = store.userStore.userInfo;

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

    return(
        <div className={styles.right}>
            <div  ref={addElement} data-delay={time*0.9} className="bullet">
                {isMobile
                ?
                <EditOutlined onClick={handleWrite} className={styles.icon}/>
                :
                <button className={`bullet ${styles.btn}`} onClick={handleWrite}>写文章</button>
                }
                
            </div>
            {
                user
                ?
                <Dropdown overlay={menu} placement="bottomLeft">
                    <Avatar size="large" src={user.avatar} />
                </Dropdown>
                :
                <div ref={addElement} data-delay={time*1.1} className="bullet">
                    {
                        isMobile
                        ?
                        <LoginOutlined onClick={() => setLogin()} className={styles.icon}/>
                        :
                        <button className={styles.btn} onClick={() => setLogin()}>登录</button>
                    }
                    
                </div>
            }
        </div>
    )
}

export default RightSide;