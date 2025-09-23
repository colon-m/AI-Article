import { useRouter } from "next/router";
import Link from "next/link";

import { useElement } from "hooks/useElement";
import navConfig from "../../navconfig";
import styles from "./index.module.scss";

const MenuNotInMobie = () => {
    const router = useRouter();
    const {addElement} = useElement();

    return (<div className={styles.main}>
        {navConfig.map((item, index) => {
            return (
                <div ref={addElement} data-delay={1000*(index + 1)} className={`bullet ${styles.opacity}`} key={index}>
                    <Link href={item.path} className={`${styles.item} ${router.pathname === item.path ? styles.active : ''}`}>{item.title}</Link>
                </div>
            )
        })}
    </div>
    )
};

export default MenuNotInMobie;