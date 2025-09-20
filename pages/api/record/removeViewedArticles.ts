import type { NextApiRequest, NextApiResponse } from "next";
import getDatabaseConnection from "db/index"
import {User, Article,Record,RecordArticle } from "db/entities";

export default async function Publish(req: NextApiRequest, res: NextApiResponse){
    const {userId} = req.body;
    const db = await getDatabaseConnection();
    const recordRep = db.getRepository(Record);
    const recordArticleRepo = db.getRepository(RecordArticle);
    let record = await recordRep.findOne({
        where:{
            user: {
                id: userId,
            }
        },
        relations:["user","recordArticles"]
    });
    if(!record){
        res.status(400).json({
            code: 7001,
            msg: "未找到记录"
        });
        return;
    }
    if (record.recordArticles && record.recordArticles.length > 0) {
        await recordArticleRepo.remove(record.recordArticles);
      }
    record.recordArticles = [];
    await recordRep.save(record);
    res.status(200).json({
        code: 0,
        msg:"成功"
    })
}