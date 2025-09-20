import type { NextApiRequest, NextApiResponse } from "next";
import getDatabaseConnection from "db/index"
import { Article } from "db/entities";

export default async function getComment(req: NextApiRequest, res: NextApiResponse){
    try{
        const {articleId: article_id} = req.query;
        const db = await getDatabaseConnection();
        const articleRep = db.getRepository(Article);
        const article = await articleRep.findOneBy({
            id:Number(article_id),
        })
        res.status(200).json({
            code: 0,
            msg: '',
            data:{
                comments: article?.comments
            }
        })
    }catch(error){
        console.log(error)
    }
}