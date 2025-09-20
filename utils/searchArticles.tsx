import type { Article } from "db/entities";
import {markdownToTxt} from "markdown-to-txt";
import { ReactElement } from "react";
import { User } from "db/entities";
import { Comment,Tag } from "db/entities";


export interface ArticleNode {
    id: number
    title: ReactElement,
    content: ReactElement,
    update_time: Date,
    user: User, 
    view: number,
    create_time: Date, 
    is_deleted: number, 
    comments: Comment[],
    tags: Tag[]
}
export const searchArticles = (articles:Article[],key: string)=>{
    const targetArticles:ArticleNode[] = [];
    const reg = new RegExp(key,"g")
    articles.forEach((article:Article )=>{
        const content =markdownToTxt(article.content)
        const articleNode: ArticleNode = {
            id: article.id,
            title: <>{article.title}</>,
            content: <>{content}</>,
            update_time: article.update_time,
            user: article.user, 
            view: article.view,
            create_time: article.create_time, 
            is_deleted: article.is_deleted, 
            comments: article.comments,
            tags: article.tags
        }
        let isExist = false;
        if(article.title.includes(key)){
            isExist = true;
            const arr = article.title.split(reg);
            const newArr =[];
            for(let i = 0; i < arr.length-1; i++){
                newArr.push(arr[i]);
                newArr.push(<strong>{key}</strong>);
            }
            newArr.push(arr[arr.length-1]);
            articleNode.title = (
            <>
                {newArr.map(item =>item)}
            </>);
        };
        if(content.includes(key)){
            isExist = true;
            const arr = content.split(reg);
            const newArr =[];
            for(let i = 0; i < arr.length-1; i++){
                newArr.push(arr[i]);
                newArr.push(<strong>{key}</strong>);
            }
            newArr.push(arr[arr.length-1]);
            articleNode.content = (
            <>
                {newArr.map(item =>item)}
            </>);
        };
        if(isExist){
            targetArticles.push(articleNode);
        }
    })
    
    return targetArticles
}