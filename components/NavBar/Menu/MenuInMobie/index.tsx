import { useRouter } from "next/router";
import Link from "next/link";

import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import {MenuOutlined} from '@ant-design/icons';

import { useElement } from "hooks/useElement";
import navConfig from "../../navconfig";
import styles from "./index.module.scss";

const MenuInMobie = ({time}: {time: number}) => {
    const router = useRouter();
    const {addElement} = useElement();
    const items: MenuProps['items'] = navConfig.map(item=>{
        return {
            key: item.path,
            label:(
                <Link href={item.path} className={`${styles.item} ${router.pathname === item.path ? styles.active : ''}`}>{item.title}</Link>
            )
        }
    });

    return (<div className={`bullet ${styles.main}`} ref={addElement} data-delay={time}>
        <Dropdown menu={{ items }} >
            <a onClick={(e) => e.preventDefault()}>
                <MenuOutlined />
            </a>
        </Dropdown>
    </div>
    )
}

export default MenuInMobie;