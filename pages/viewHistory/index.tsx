import { useState,useEffect } from "react";
import Link from "next/link";
import { Avatar } from "antd";
import { observer } from "mobx-react-lite";
import { IrecordInfo } from "store/viewArticlesStore";
import fetch from "service/fetch";
import formatRelativeDate from "utils/formatRelativeDate ";

import { useStore } from "store";
import styles from './index.module.scss';

const viewedHistory = () => {
    const store = useStore();
    const { user,records } = store.viewedArticlesStore;
    const [recordArticles,setArticles] = useState<IrecordInfo[]>(records);
    const handleClearHistory = () => {
        store.viewedArticlesStore.removeHistory();
    }
    useEffect(()=>{
        // if(typeof user !== 'string' && user && user?.id){
        //     fetch.get(`/api/record/getViewedArticles?userId=${user.id}`, {
        //     }).then((res:any)=>{
        //         if(res.code === 0){
        //             console.log
        //             setArticles(res.data.records);
        //         }
        //     })
        // }else{
        //     setArticles(records);
        // }
        // records.sort((a, b) => new Date(b!.time).getTime() - new Date(a!.time).getTime());
        setArticles(records)
    },[records.length])
    return (
        <div className={styles.container}>
            <div className={styles.center}>
                <div className={styles.header}>
                    <h2 className={styles.title}>浏览历史</h2>
                    <div className={styles.clearHistory} onClick={handleClearHistory}><span >清空历史记录</span></div>
                </div>
                
                <ul>
                    {recordArticles?.length > 0 && recordArticles.map((article,index,arr) => (
                        <li key={article!.id} className={styles.item}>
                            {index > 0 && formatRelativeDate(String(article!.time)) === formatRelativeDate(String(arr[index - 1]?.time)) ? null : (
                                <div className={styles.date}>{formatRelativeDate(String(article!.time))}</div>
                            )}
                            <div className={styles.userInfo}>
                                <Avatar className={styles.avatar} size={30} src={article!.user!.avatar} />
                                <div className={styles.nickname}><span>{article!.user!.nickname}</span></div>
                            </div>
                            <Link href={`/article/${article!.id}`} className={styles.articleTitle}>
                                {article!.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    );
};
viewedHistory.ShowSideCard = false;

export default observer(viewedHistory);