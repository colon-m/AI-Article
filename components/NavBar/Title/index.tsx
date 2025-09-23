import { useEffect,useRef } from "react";

import { useElement } from "hooks/useElement";
import styles from "./index.module.scss"

type Props ={
    time: number,
    isMobile: boolean
}
const Title = ({time,isMobile}:Props) => {
    const {addElement} = useElement();
    const titleRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        if(isMobile && titleRef && titleRef.current){
            titleRef.current.classList.remove(styles.right);
            titleRef.current.classList.add(styles.center);
        }else if(titleRef && titleRef.current){
            titleRef.current.classList.remove(styles.center);
            titleRef.current.classList.add(styles.right);
        }
        
    },[isMobile]);

    return(<div ref={addElement}  data-delay={time} className={`bullet ${styles.logo}`}>
        <div ref={titleRef}>
            AI-ARTICLE
        </div>
    </div>)
}

export default Title;