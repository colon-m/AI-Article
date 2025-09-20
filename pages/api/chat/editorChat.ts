import { NextApiRequest, NextApiResponse } from "next";
import { LLMServiceFactory } from "AI";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { text } = await req.body;
  const agent: any = LLMServiceFactory.createAgent("editor");

  try {
    const response = await agent.chat(text);
    res.status(200).json(response);
  } catch (error) {
    res.status(200).json({
      code: 500,
      msg: "Internal server error"
    });
  }
}