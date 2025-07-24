import type { NextApiRequest, NextApiResponse } from "next";
import getDatabaseConnection from "db/index"
import { User } from "db/entities";
import { Article } from "db/entities";
import { Comment } from "db/entities";


export default async function Publish(req: NextApiRequest, res: NextApiResponse){
    const {article_id,user_id,content} = req.body;
    console.log("content:",content)
    const db = await getDatabaseConnection();
    const userRep = db.getRepository(User);
    const articleRep = db.getRepository(Article);
    const commentRep = db.getRepository(Comment);
    const article = await articleRep.findOneBy({
        id:article_id,
    })
    const user = await userRep.findOneBy({
        id:user_id,
    })
    const comment = new Comment();
    comment.content = content;
    comment.create_time = new Date();
    comment.is_deleted = 0;
    comment.user = user!;
    comment.article = article!;
    await commentRep.save(comment);

    res.status(200).json({
        code: 0,
        msg: '发布成功'
    })
}