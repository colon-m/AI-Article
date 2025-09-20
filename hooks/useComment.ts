import useSWR from "swr";
import axios from "axios";
import fetch from "service/fetch";
export const useComment = (articleId:number)=>{
    const fetcher = (url:string) => axios.get(url).then(res => res.data);
    const {data,error,isLoading,mutate} = useSWR(`/api/comment/aboutArticle/getComment?articleId=${String(articleId)}`,fetcher);
    const submit = async(user_id: number,content: string)=>{
        const res = await fetch.post('/api/comment/publish',{
            article_id: articleId,
            user_id,
            content
        })
        mutate();
        return res;
    }
    return {
        data,
        isLoading,
        error,
        submit
    }
}