import { useRouter } from "next/router";
import { useEffect,useState,useRef } from "react";
import { message,Spin } from "antd";
import { Article } from "db/entities";
import fetch from "service/fetch";
import ListItem from "components/ListItem";
import styles from "./index.module.scss"

const categoryArticle = ()=>{
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setLoading] = useState<Boolean>(true);
    const [page, setPage] = useState<Number>(0);
    const [count, setCount] = useState<Number>(0);
    const [loadTXT, setTxt] = useState<String>("加载更多");

    const curArticles = useRef<HTMLDivElement>(null);
    const [messageAPI,contextHolder] = message.useMessage();
    const router = useRouter();
    useEffect(()=>{
        isLoading && fetch.get(`/api/article/request?page=${page}&category=${router.query.category}`)
        .then((res:any)=>{
            if (res.code === 0) {
                setArticles([...articles,...res.data.trueArticles]);
                setCount(res.data.trueCount);
                setPage(pre=> Number(pre)+1)
                console.log("articles:",articles)
             } else {
                messageAPI.error("读取失败");
             }
        }).catch( error =>{
            messageAPI.error("error");
            console.log(error);
        });
        
    },[isLoading]);

    useEffect(()=>{
        const lastArticle = curArticles.current?.lastElementChild as HTMLDivElement;
        if(!lastArticle) return;
        const observer = new IntersectionObserver(()=>{
            if(Number(count) < articles.length) {
                setLoading(true);
            }else{
                observer.unobserve(lastArticle);
                observer.disconnect();
                setTxt("暂无更多");
                setLoading(false)
            }
        },{threshold: 0.1});
        observer.observe(lastArticle);
        return ()=>{
            observer.unobserve(lastArticle!);
            observer.disconnect();
        }
    },[articles])

    return (
    <div className={`${styles.container} centerlayout`}>
      {contextHolder}
      <div className={styles.head}>
        <div  className={styles.txt}>
          <h2>{router.query.category}</h2>
        </div>
      </div>
      <div ref={curArticles}>
        {articles.map(article=>{
          return <ListItem key={article.id} isFirstRender article={article}/>
        })}
      </div>
      <div className={styles.loadArea}>
          {isLoading? <Spin /> :<div>{loadTXT}</div>}
      </div>
      
    </div>
  )
}

export default categoryArticle;