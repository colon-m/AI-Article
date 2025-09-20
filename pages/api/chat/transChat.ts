import { NextApiRequest, NextApiResponse } from "next";
import fetch from "service/fetch";
// 修改后的后端API路由
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { text } = req.body;
    const apiKey = process.env.DEEPSEEK_API_KEY;
    const appId = process.env.APP_ID;// 替换为实际的应用 ID

    const url = `https://dashscope.aliyuncs.com/api/v1/apps/${appId}/completion`;
    console.log("请求URL:",url);
    const data = {
        input: {
            prompt: text
        },
        parameters: {},
        debug: {}
    };
    try{
        const response = await fetch.post(url, data,{
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
        });
        console.log('backend AI Service Response.data:', response.data);
        if(response.status !== 200){
            res.status(200).json({
                code: response.status,
                msg: response.data.message || `API 错误码 ${response.data.code}`
            });
        }else{
            res.status(200).json({
                code: 0,
                msg: '请求成功',
                data: response.data.output.text
            });
        }
    } catch (error:any) {
        res.status(200).json({
            code: -1,
            msg: error.message || '请求失败'
        });
    }
}