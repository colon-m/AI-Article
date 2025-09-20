import { useState,useEffect } from "react";
import Link from "next/link";
import {message} from "antd";
import fetch from "service/fetch";
import { Article } from "db/entities";
import ListItem from "components/ListItem"
import styles from "./index.module.scss";
interface ICategoryArticles{
  categoryName: string,
  articles: Article[]
}
const categories = () => {
  const [allArticles,setAllArticles] = useState<ICategoryArticles[]>();
  const [messageAPI,context] = message.useMessage();
  useEffect(()=>{
    fetch.get("/api/article/getCategories").then((res:any)=>{
      res.code === 0 ? setAllArticles(res.data.articles): messageAPI.error(res.msg);
      console.log("res.data.articles:",res.data.articles)
    }).catch((err)=>{
      messageAPI.error(err)
    });
  },[])

  return (
    <div className={`${styles.container} centerlayout`}>
      {
        allArticles?.map((item:any)=>{
          return (
            <>
              <div key={item} className={styles.oneCategoryArticles}>
                <div className={styles.header}>
                  <div className={styles.categoryName}><h3>{item.categoryName}</h3></div>
                  <div className={styles.more}>
                    <Link href={{
                        pathname: '/article/category/[category]',
                        query: { category: item.categoryName},
                      }}>更多文章
                    </Link>
                  </div>
                </div>
                <div className={styles.articles}>
                  {item.articles.map((article:Article)=>{
                    return <ListItem article={article}/>
                  })}
                </div>
              </div>
              <div className={styles.devider}></div>
            </>
          )
        })
      }
    </div>
  )
}

export default categories;