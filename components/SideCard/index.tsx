import Link from "next/link";
import { useState,useEffect } from "react";
import { Avatar } from "antd";
import { observer } from "mobx-react-lite";
import { useStore } from "store";
import extractRecommendTags from "utils/extractRecommendTags";
import {getRecommendedArticles} from "service/recommend";
import styles from './index.module.scss';
const SideCard = () => {
    const store = useStore();
    const { viewedArticlesStore } = store;
    const [records,setArticles] = useState(viewedArticlesStore.records);
    const [recommends,setRecommends] = useState([]);

    useEffect(()=>{
        setArticles(viewedArticlesStore.records);
    },[viewedArticlesStore.records]);
    useEffect(()=>{
        const tags = extractRecommendTags(viewedArticlesStore.name);
        getRecommendedArticles(tags).then((res) => {
            setRecommends(res);
        });
    },[viewedArticlesStore.name]);
    return (
        <div className={`mediaSider ${styles.container}`}>
            <div className={styles.viewHistory}>
                <div className={styles.header}>
                    <h4>最近浏览</h4>
                    <Link href="/viewHistory">查看全部 &gt;</Link>
                </div>
                <div className={styles.content}>
                    <ul>
                        {
                        records?.length > 0 && records.slice(0, 5).map((record) => (
                            <li key={record!.id} className={styles.item}>
                                <div className={styles.avatar}>
                                    <Avatar size="small" src={record!.user!.avatar} />
                                </div>
                                <div className={styles.title}>
                                    {record!.title}
                                </div>
                            </li>
                        ))
                    }
                    </ul>
                </div>
            </div>
            <div className={styles.recommend}>
                <div className={styles.header}>
                    <h4>推荐文章</h4>
                </div>
                <div className={styles.content}>
                                    <div className={styles.content}>
                    <ul>
                        {
                        recommends?.length > 0 && recommends.slice(0, 10).map((article: any) => (
                            <li key={article!.id} className={styles.item}>
                                <div className={styles.avatar}>
                                    <Avatar size="small" src={article!.user!.avatar} />
                                </div>
                                <div className={styles.title}>
                                    {article!.title}
                                </div>
                            </li>
                        ))
                    }
                    </ul>
                </div>
                </div>
            </div>
        </div>
    );
};

export default observer(SideCard);
