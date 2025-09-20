import { NextApiRequest, NextApiResponse } from "next";
import { LLMServiceFactory } from "AI";
// 修改后的后端API路由
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 设置 SSE 响应头
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // 禁用 Nginx 缓冲

  // 确保立即发送响应头
  res.flushHeaders();

  try {
    const { message } = req.body;
    const agent = LLMServiceFactory.createAgent("global");
    
    // 获取流式响应
    const responseStream = await agent.chat(message) as AsyncIterable<string>;

    // 修复后的遍历流发送数据
    for await (const chunk of responseStream) {
        res.write(chunk);
      // 手动刷新缓冲区，确保数据立即发送
      if (typeof (res as any).flush === 'function') {
        (res as any).flush();
      }
    }
    
    // 结束响应
    res.end();
  } catch (error) {
    console.error('API error:', error);
    
    // 发送错误信息
    res.write('data: {"error": "Internal server error"}\n\n');
    res.end();
  }
}