import { useState,useEffect, use } from 'react';
import styles from './index.module.scss';
import { Article } from 'db/entities/article';
import { Avatar } from 'antd';
import { format } from 'date-fns';
import {EyeOutlined} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';
import { ArticleNode } from '@/utils/searchArticles';
interface Iprops {
    arts:Article[] | ArticleNode[],
    ref?: any,
    isFirstRender?: boolean
    index?: number
}
const ListItem = ({index,arts,ref,isFirstRender}:Iprops) =>{
    const {title,content,update_time,user, view,id} = arts[index!]
    const {nickname,avatar} = user
    const router = useRouter()
    const handleGoToDetails = ()=>{
        router.push(`/article/${id}`)
    }

    return(
        <div className={styles.item} style={{transform: `translateY(${index! * 95}px)`}}>
            <div  className={styles.article} onClick={handleGoToDetails}>
                <div className={styles.titleArea}>
                    <div ref={ref} data-delay={100*id} className={`${isFirstRender && "opcity"} ${styles.text}`}><span>标题：</span></div>
                    <div ref={ref} data-delay={100*id} className={`${isFirstRender && "opcity"} ${styles.title}`} ><h4>{title}</h4></div>
                </div>
                <div ref={ref} data-delay={100*id} className={`${isFirstRender && "opcity"}`}><p className={styles.content}>{content}</p></div>
            </div>
            <div className={styles.info}>
                <div ref={ref} data-delay={100*id} className={`${isFirstRender && "opcity"} ${styles.avatarArea}`}>
                    <Avatar className={styles.avatar} size="small" src={avatar}></Avatar>
                </div>
                <div ref={ref} data-delay={100*id} className={`${isFirstRender && "opcity"} ${styles.author}`}>{nickname}</div>
                <div ref={ref} data-delay={100*id} className={`${isFirstRender && "opcity"} ${styles.time}`}>修改时间：{format(new Date(update_time),'MM/dd/yyyy')}</div>
                <div ref={ref} data-delay={100*id} className={`${isFirstRender && "opcity"} ${styles.view}`}>
                    <EyeOutlined />
                    <div ref={ref} data-delay={100*id} className={`${isFirstRender && "opcity"} ${styles.number}`}>
                        <span>{view}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default observer(ListItem);