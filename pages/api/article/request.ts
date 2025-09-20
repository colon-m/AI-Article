import type { NextApiRequest, NextApiResponse } from "next";
import getDatabaseConnection from "db/index"
import { User,Article,Tag } from "db/entities";

export default async function Publish(req: NextApiRequest, res: NextApiResponse){
  let {page = 1,category= "all"} = req.query;
  const db = await getDatabaseConnection();
  const articleRep = db.getRepository(Article);
  const tagRep = db.getRepository(Tag);
  page = Number(page) - 1;
  let trueArticles: Article[] = [];
  let trueCount = 0;
  if(category === "all"){
    const [articles, count] = await articleRep.findAndCount({
    relations:{
      user: true
    },
    order:{
      update_time: "DESC"
    },
    skip: Number(page) *10,
    take: 10
    });
    trueArticles = articles;
    trueCount =count;
  }else if(category === "未分类"){
    const [noCategoryArticles,count] = await articleRep
    .createQueryBuilder("article")
    .take(10)
    .skip(Number(page) * 10)
    .orderBy("article.update_time", "DESC")
    .leftJoinAndSelect("article.tags", "tag")
    .leftJoinAndSelect("article.user", "user") 
    .leftJoin('tags_articles_rel', 'tag_rel', 'tag_rel.article_id = article.id')
    .where('tag_rel.article_id IS NULL') // 中间表中没有对应记录，即无标签
    .getManyAndCount();
    trueArticles =noCategoryArticles;
    trueCount = count;
  }else{
    const [otherCategoryArticles,count] = await articleRep.findAndCount({
      relations:{
          user: true,
          tags: true
        },
      where:{
        tags:{
          title: category as string
        }
      },
      take: 10,
      skip: Number(page)*10,
      order: {
        create_time: 'DESC' 
      }
    });
    trueArticles =otherCategoryArticles;
    trueCount = count;
  }
  res.status(200).json({
      code: 0,
      msg: '',
      data:{
          trueArticles,
          trueCount
      }
  })
}