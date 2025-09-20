import type { NextApiRequest, NextApiResponse } from "next";
import getDatabaseConnection from "db/index"
import { Record } from "db/entities";
import { EXCEPTION_USER } from "../exception.config";


export default async function Publish(req: NextApiRequest, res: NextApiResponse){
        // 1. 验证请求方法
    if (req.method !== 'GET') {
        return res.status(405).json({ 
            code: 405,
            msg: "只支持GET方法" 
        });
    }

    // 2. 获取并验证userId
    const { userId } = req.query;
    
    // 严格验证userId是否为有效数字
    const userIdNumber = Number(userId);
    if (isNaN(userIdNumber) || userIdNumber <= 0) {
        return res.status(400).json({
            ...EXCEPTION_USER.NOTFOUND,
            details: `无效的用户ID: ${userId}`
        });
    }

    const db = await getDatabaseConnection();
    const recordRep = db.getRepository(Record);
    const record = await recordRep.findOne({
        where:{
            user:{
                id: userIdNumber
            }
        },
        relations: {
            user: true,
            recordArticles: {
                record: true,      // 加载 RecordArticle 的 record 关联
                article: {
                    user: true   // 加载 Article 的 user 关联
                }      // 加载 RecordArticle 的 article 关联
            }
        }
    })
    console.log("record.recordArticles:", record!.recordArticles);
    if(record==null){
         res.status(200).json({...EXCEPTION_USER.NOTFOUND})
         return
    }
    res.status(200).json({
        code: 0,
        msg:"成功",
        data:{
            records: record.recordArticles.map(record=>{
                return{
                    articleId: record.article.id,
                    title: record.article.title,
                    user: record.article.user,
                    time: record.visit_time
                }
            }) || []
        }
    })
}