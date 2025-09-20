import { NextApiRequest, NextApiResponse } from "next";
import { getRepository } from "typeorm";
import getDatabaseConnection from "db/index";
import { Article,User,Tag } from "@/db/entities";
export default async function getAllArticles(req: NextApiRequest, res: NextApiResponse) {
    const db = await getDatabaseConnection();
    const tagRep = db.getRepository(Tag);
    const articleRep = db.getRepository(Article);
    let articles = [];
    const tags = await tagRep.find({
        relations: {
            articles: {
                user:true
            }
        }
    });
    const noCategoryArticles = await articleRep
    .createQueryBuilder("article")
    .limit(3)
    .leftJoinAndSelect("article.tags", "tag")
    .leftJoinAndSelect("article.user", "user") 
    .leftJoin('tags_articles_rel', 'tag_rel', 'tag_rel.article_id = article.id')
    .where('tag_rel.article_id IS NULL') // 中间表中没有对应记录，即无标签
    .getMany();

    tags && tags.forEach((tag: Tag)=>{
        articles.push({
            categoryName: tag.title,
            articles: tag.articles.slice(0,3)
        })
    }),
    noCategoryArticles && articles.push({
        categoryName: "未分类",
        articles: noCategoryArticles
    }),
    articles ? res.status(200).json({
        code: 0,
        msg: "",
        data:{
            articles
        }
    }) : res.status(200).json({
        code: 0,
        msg: "暂无文章",
    })
    
}