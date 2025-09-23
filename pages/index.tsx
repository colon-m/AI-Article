import getDatabaseConnection from "db";
import { Article } from "db/entities/article";
import {Input,message,Spin, Pagination } from "antd";
import styles from "./index.module.scss";
import React,{ useEffect, useState,useRef } from "react";
import { searchArticles } from "utils/searchArticles";
import { ArticleNode } from "utils/searchArticles";
import { useElement } from "hooks/useElement";
import fetch from "service/fetch";
import List from "components/List";
import Head from "next/head";
import { useRouter } from "next/router";

const { Search } = Input;
interface Iprops {
  articles : Article[] | ArticleNode[],
  count: number,
  totalPages: number,
  currentPage: number,
  isCrawler?: boolean,
  pageSize: number;
}
const isCrawler = (userAgent: string): boolean => {
  const crawlers = [
    "googlebot",
    "bingbot",
    "baiduspider",
    "yandex",
    "duckduckbot",
    "sogou",
    "exabot",
    "facebot",
    "ia_archiver"
  ];
  return crawlers.some(bot => userAgent.toLowerCase().includes(bot));
};

export async function getServerSideProps(context: any){
  const { req, query } = context;
  const userAgent = req.headers["user-agent"] || "";
  console.log("query:",query);

  
  // 识别爬虫
  const isBot = isCrawler(userAgent);
  const db = await getDatabaseConnection();
  const articleRep = db.getRepository(Article);

  const page = query.page ? parseInt(query.page as string) : 1;
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const [articles, count] = await articleRep.findAndCount({
    relations:{
      user: true
    },
    order:{
      update_time: "DESC"
    },
    skip,
    take: pageSize
  })

  const totalPages = Math.ceil(count / 10);

  return {
    props:{
      articles: JSON.parse(JSON.stringify(articles)),
      count,
      totalPages,
      currentPage: page,
      pageSize,
      isCrawler: isBot
    }
  }
}

const Home = ({articles, count, totalPages, currentPage, pageSize, isCrawler = false}:Iprops)=>{
  "use client";
  const [messageApi, contextHolder] = message.useMessage();
  const [arts,setArts] = useState<Article[] | ArticleNode[]>(articles);
  const [key, setKey] = useState<string>("");
  const {elements,addElement} = useElement();
  const [page, setPage] = useState<number>(currentPage);
  const curArticles = useRef<HTMLDivElement>(null);
  const [total,setTotal] = useState<number>(count);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isFirstRender,setFirstRender] = useState<boolean>(true);
  const [loadTXT,setTXT] = useState<string>("加载更多");
  const router = useRouter(); 

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const currentUrl = `${siteUrl}${router.asPath.split('?')[0]}`;

  const loadMore = async ()=>{
    try{
      setLoading(true);
      const res: any = await fetch.get(`/api/article/request?page=${page+1}&category=all`);
      console.log("res:",res);
      if(res.data.code === 0){
        const { trueArticles, trueCount } = res.data.data;
        setArts(prev => [...prev, ...trueArticles]);
        setPage(prev => prev + 1);
        setTotal(trueCount);
          if (arts.length + trueArticles.length >= trueCount) {
            setTXT("已全部加载");
          }
      }else{
        messageApi.error(res.msg);
      }
    } catch (error) {
    console.error("加载更多错误:", error);
    messageApi.error("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    elements.current.map((item: HTMLDivElement) => {
      setTimeout(() => {
        item.classList.add(styles.initStatus);
        setFirstRender(false);
      }, Number(item.dataset.delay));
    });
    if (!curArticles.current?.children[0] || isLoading) return;
    const handleScroll = () => {
      if(isLoading) return;
      const { scrollTop, scrollHeight, clientHeight } = curArticles.current?.children[0] as HTMLDivElement;
      console.log("scrollTop:", scrollTop, "clientHeight:", clientHeight, "scrollHeight:", scrollHeight);
      if (scrollTop + clientHeight + 95 >= scrollHeight && arts.length < total) {
        loadMore();
      }else if(arts.length >= total){
        setTXT("已全部加载");
        curArticles.current?.children[0].removeEventListener("scroll", handleScroll);
      }
    };
    curArticles.current.children[0].addEventListener("scroll", handleScroll);
    return () => {
      curArticles.current?.children[0].removeEventListener("scroll", handleScroll);
    }
  }, [isLoading,arts,total]);

  const handleSearch = ()=>{
    if(!key){
      messageApi.warning("请输入关键字！");
      return
    }
    setArts(searchArticles(articles as Article[],key));
  };

  const handleSetKey = (e: React.ChangeEvent<HTMLInputElement>)=>{
    setKey(e.target.value)
  }

  const handlePageChange = (newPage: number) => {
    router.push(`?page=${newPage}`);
  };

  return (
    <div className={`${styles.container} centerlayout`}>
      {isCrawler &&
        <Head>
          <title>{`文章列表 - 第${currentPage}页`}</title>
          <meta 
            name="description" 
            content={`浏览我们的文章集合，第${currentPage}页，共${totalPages}页`} 
          />
          
          {/* 规范链接 */}
          <link 
            rel="canonical" 
            href={
              currentPage === 1 
                ? currentUrl 
                : `${currentUrl}?page=${currentPage}`
            } 
          />
          
          {/* 分页关系标签 */}
          {currentPage > 1 && (
            <link rel="prev" href={`${currentUrl}?page=${currentPage - 1}`} />
          )}
          {currentPage < totalPages && (
            <link rel="next" href={`${currentUrl}?page=${currentPage + 1}`} />
          )}
        </Head>
      }
      {contextHolder}

      <div className={styles.head}>
        <div ref={addElement} data-delay={1356} className={styles.txt}>
          <h2>文章</h2>
        </div>
        <div ref={addElement} data-delay={1232} className={styles.searchArea}>
          <Search className={`mediaSearch ${styles.search}`} placeholder="输入关键字" value={key} onChange={handleSetKey}  onSearch={handleSearch} enterButton />
        </div>
      </div>
      <div ref={curArticles} className={styles.articles}>
        <List arts={arts} addElement={addElement} isFirstRender={isFirstRender}/>
      </div>
      <div className={styles.loadArea}>
          {isLoading? <Spin /> :<div>{loadTXT}</div>}
      </div>
      <div className={styles.crawlerPagination}>
        {isCrawler && Array.from({ length: totalPages }, (_, i) => (
          <a
            key={i + 1}
            href={`?page=${i + 1}`}
            className={currentPage === i + 1 ? styles.active : ""}
            aria-label={`转到第${i + 1}页`}
          >
            {i + 1}
          </a>
        ))}
      </div>
    </div>
    
  )
}

export default Home;