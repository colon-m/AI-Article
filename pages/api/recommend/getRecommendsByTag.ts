// pages/api/recommend/getRecommendsByTag.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import getDatabaseConnection from 'db/index';
import { Article } from 'db/entities/article';
import { Tag } from 'db/entities/tag';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ code: 405, msg: 'Method not allowed' });
    }

    const { tag } = req.query;
    if (!tag || typeof tag !== 'string') {
      return res.status(400).json({ code: 400, msg: 'Missing or invalid tag' });
    }

    const db = await getDatabaseConnection();
    const articleRepo = db.getRepository(Article);

    // 方式1：通过Article直接关联查询（更简洁）
    const tagArticles = await articleRepo.find({
      where: {
        is_deleted: 0,
        tags: { title: tag }, // 通过标签标题过滤
      },
      relations: ['user', 'tags'], // 关联用户和标签
      order: { view: 'DESC' }, // 按浏览量降序
      take: 10, // 最多返回10条
    });

    // 方式2：如果方式1查询不到结果，可尝试通过Tag反向查询（兼容旧数据）
    if (tagArticles.length === 0) {
      const tagRepo = db.getRepository(Tag);
      const targetTag = await tagRepo.findOne({
        where: { title: tag },
        relations: ['articles', 'articles.user'], // 关联文章和用户
      });
      if (targetTag) {
        // 对标签关联的文章按浏览量排序并取前10
        tagArticles.push(
          ...targetTag.articles
            .filter(article => article.is_deleted === 0) // 排除已删除
            .sort((a, b) => b.view - a.view) // 降序排列
            .slice(0, 10) // 取前10
        );
      }
    }

    return res.status(200).json({
      code: 0,
      msg: 'success',
      data: { articles: tagArticles },
    });
  } catch (error) {
    console.error('Get recommends by tag error:', error);
    return res.status(500).json({ code: 500, msg: 'Server error' });
  }
}