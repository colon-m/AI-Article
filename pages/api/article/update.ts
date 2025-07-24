import type { NextApiRequest, NextApiResponse } from "next";
import getDatabaseConnection from "db/index"
import { Article } from "db/entities/article";
import { Tag } from "db/entities/tag";
import {EXCEPTION_ARTICLE} from "../exception.config"


export default async function Publish(req: NextApiRequest, res: NextApiResponse){
    const {id,title,content,tagsName} = req.body;
    const db = await getDatabaseConnection();
    const articleRep = db.getRepository(Article);
    const tagRep = db.getRepository(Tag);

    const article = await articleRep.findOne({
        where:{id,},
        relations:["tags"]
    });
    if(!article){
        res.status(200).json(EXCEPTION_ARTICLE.NOTFOUND);
        return;
    }
    article?.tags.forEach(tag => {
        tag.article_count -= 1;
    });
    await articleRep.save(article!);

    const articleTags = await tagRep.find({
        where:tagsName.map((tag:string)=>({title: tag}))
    })
    articleTags.map(tag =>{
        tag.article_count += 1
    })
    article!.tags = articleTags;
    
    if(article){
        article.title = title;
        article.content = content;
        article.update_time = new Date();
        await articleRep.save(article)
        res.status(200).json({
            code: 0,
            msg: '修改成功'
        })
    }

}