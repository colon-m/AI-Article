import { GetStaticPaths,GetStaticProps  } from 'next';
import { useEffect,useRef } from 'react';
import { serialize } from 'next-mdx-remote/serialize';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import rehypeSlug from 'rehype-slug';
import rehypeToc from '@jsdevtools/rehype-toc';
import getDatabaseConnection from "db";
import { useStore } from 'store';
import { Article } from "db/entities/article";
import styles from './index.module.scss';
import Comment from "components/Comment";
import ArticleDetail from "components/Article";
import debounce from 'utils/Debounce';

export const getStaticPaths: GetStaticPaths = async ()=>{
    const db = await getDatabaseConnection();
    const articleRep = db.getRepository(Article);
    const articles = await articleRep.find();
    const paths  = articles.map((article)=>{
        return {
            params: {
                id: '' + article.id
            }
        }
    })
    return {paths,fallback: "blocking"}
}
export const getStaticProps:GetStaticProps  = async ({ params }: any) =>{
    const id = Number(params.id);
    const db = await getDatabaseConnection();
    const articleRep = db.getRepository(Article);
    const article = await articleRep.findOne(
        {
            where:{
                id,
            },
            relations:[
                "user",
                "tags"
            ]
        },

    );
    if(article){
        const view = article.view + 1;
        article.view = view;
        articleRep.save(article);
    }

    const content = article?.content;
    const mdxSource = !!content ? await serialize(content, {
        mdxOptions: {
            remarkPlugins: [remarkMath],
            rehypePlugins: [rehypeSlug,rehypeHighlight,rehypeKatex, [rehypeToc, { headings: ['h1','h2', 'h3','h4','h5', 'h6'] }]],
        },
        }) : '';
    
    return {
        props: {
            article: JSON.parse(JSON.stringify(article)),
            mdxSource
        },
        revalidate: 10
    }
}

const Detail = ({article,mdxSource}: {article:Article,mdxSource:any})=>{
    const store = useStore();
    const durationRef = useRef<number>(0);
    const startTime = useRef<number>(Date.now());
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startCount = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        startTime.current = Date.now(); // 重置起始时间
        timerRef.current = setInterval(() => {
            if (document.visibilityState === "visible") {
                durationRef.current += Math.floor((Date.now() - startTime.current) / 1000);
                startTime.current = Date.now();
            }
        }, 4000);
    };
    const saveRecord = () => {
        if (durationRef.current < 10) return; 
        const saveRecord = {
            articleId: article.id,
            title: article.title,
            user: article.user,
            tags: article.tags.map(t=>t.title),
            duration: durationRef.current,
            time: new Date(),
        }
        store.viewedArticlesStore.addRecord(saveRecord);
    }
    const debouncedSaveRecord = debounce(saveRecord, 3000);
    const handleVisibilityChange = () => {
        if (document.visibilityState === "hidden") {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                debouncedSaveRecord();
            }
        } else if (document.visibilityState === "visible") {
            startCount();
        }
    };
    useEffect(()=>{
        startCount();
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("beforeunload", debouncedSaveRecord);
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("beforeunload", debouncedSaveRecord);
            debouncedSaveRecord();
        }
    },[article.id])
    return (
        <>
            <ArticleDetail article={article} mdxSource={mdxSource}/>
            <div className={styles.divider}></div>
            <Comment id={article.id}/>
        </>
    )
}

export default Detail;