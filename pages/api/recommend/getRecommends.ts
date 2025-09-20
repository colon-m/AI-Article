import type { NextApiRequest, NextApiResponse } from 'next';
import getDatabaseConnection from 'db/index'; // 你的数据库连接函数
import { Article } from 'db/entities/article';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ code: 405, msg: 'Method not allowed' });
    }

    const db = await getDatabaseConnection();
    const articleRepo = db.getRepository(Article);

    // 查询浏览量前10的文章（排除已删除）
    const topArticles = await articleRepo.find({
      where: { is_deleted: 0 }, // 假设0=未删除，1=已删除
      relations: ['user', 'tags'], // 关联查询用户和标签信息
      order: { view: 'DESC' }, // 按浏览量降序排列
      take: 10, // 限制10条
      skip: 0,
    });

    return res.status(200).json({
      code: 0,
      msg: 'success',
      data: { articles: topArticles },
    });
  } catch (error) {
    console.error('Get recommends error:', error);
    return res.status(500).json({ code: 500, msg: 'Server error' });
  }
}