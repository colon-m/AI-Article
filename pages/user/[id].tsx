import styles from "./index.module.scss";
import React,{ useEffect,useState } from "react";
import fetch from "service/fetch";
import { useStore } from "store";
const User = ()=>{
    const {id,avatar,nickname,job,introduce} = useStore().userStore.userInfo!;
    const [articles,setArticles] = useState([])
    const [tags,setTags] = useState([])
    useEffect(() => {
        fetch.get('/api/article/get').then((res: any)=>{
            if(res.code === 0){
                setArticles(res.data.articles)
            }
        })
        fetch.get('/api/tag/get').then((res: any)=>{
            if(res.code === 0){
                setTags(res.data.followTags)
            }
        })
    }, [])
    console.log("articles:",articles);
    console.log("tags:",tags);
    return(
        <div className={`${styles.container} centerlayout`}>
            个人中心
        </div>
    )
}

export default User;