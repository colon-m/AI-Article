import type { NextApiRequest, NextApiResponse } from "next";
import getDatabaseConnection from "db/index"
import { getIronSession } from "iron-session";
import type { ISession } from "pages/api/interface";
import { IronOptions } from "config/index";
import { User } from "db/entities/user";
import { Article } from "db/entities/article";
import { Tag } from "db/entities/tag";


export default async function Publish(req: NextApiRequest, res: NextApiResponse){
    const {title,content,tagsName} = req.body;
    const session:ISession = await getIronSession(req,res,IronOptions);
    const db = await getDatabaseConnection();
    const userRep = db.getRepository(User);
    const articleRep = db.getRepository(Article);
    const tagRep = db.getRepository(Tag);
    const id = session.id
    const user = await userRep.findOneBy({
        id,
    })
    const article = new Article();
    article.title = title;
    article.content = content;
    article.create_time = new Date();
    article.update_time = new Date();
    article.is_deleted = 0;
    article.view = 0;
    if(user){
        article.user = user;
    }
    const tags = await tagRep.find({
            where: tagsName.map((tagname: string)=>{
                return { title: tagname}
            })
        })

    console.log("tags:",tags);
    tags.forEach((tag)=>{
        tag.article_count += 1;
    })
    
    if(tags != null){
        article.tags = tags
    }
    await articleRep.save(article)
    res.status(200).json({
        code: 0,
        msg: '发布成功'
    })
}