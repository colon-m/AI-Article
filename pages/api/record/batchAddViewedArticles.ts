import type { NextApiRequest, NextApiResponse } from "next";
import getDatabaseConnection from "db/index"
import {User, Article,Record,RecordArticle } from "db/entities";
import { EXCEPTION_ARTICLE } from "../exception.config";
import { IrecordInfo } from "store/viewArticlesStore";

export default async function Publish(req: NextApiRequest, res: NextApiResponse){
    const {userId,records} = req.body;
    console.log("addViewedArticle",userId,records);
    const db = await getDatabaseConnection();
    const recordRep = db.getRepository(Record);
    const articleRep = db.getRepository(Article);
    const userRep = db.getRepository(User);
    
    let record = await recordRep.findOne({
        where:{
            user: {
                id: userId,
            }
        },
        relations:["user","recordArticles"]
    });
    if (!record) {
        record = new Record();
        const user = await userRep.findOne({
            where: {
                id: userId
            }
        });
        if(!user){
            res.status(200).json({...EXCEPTION_ARTICLE.NOTFOUND})
            return
        }
        record.user = user;
    await recordRep.save(record);
    }

    for(let articleRecord of records){
        const article = await articleRep.findOne({
            where:{
                id: articleRecord!.articleId
            }
        });
        if(article){
            const viewedArticle = new RecordArticle();
            viewedArticle.article = article;
            viewedArticle.visit_time = articleRecord!.time;
            viewedArticle.record = record; 
            record?.recordArticles.push(viewedArticle);
            await recordRep.save(record!);
        } 
    }
    res.status(200).json({
        code: 0,
        msg:"成功"
    })
}