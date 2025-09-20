// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "service/fetch";
import md5 from "md5";
import { format } from "date-fns";
import { encode } from "js-base64";
import { getIronSession,IronSession } from "iron-session";
import { IronOptions } from "config/index";
import type { ISession, Data } from "pages/api/interface";


export default async function(req: NextApiRequest, res: NextApiResponse<Data>) {
  const {phone} = req.body;
  const authToken = 'b4eae88c30084f75b656d6097a860c50';
  const accountSID = '2c94811c9787a27f0198094de5a81c7a';
  const appID = '2c94811c9787a27f0198094de7441c81';
  const date = format(new Date(), 'yyyyMMddHHmmss');
  const sigParam = md5(`${accountSID}${authToken}${date}`)
  const authorization = encode(`${accountSID}:${date}`);
  const url = `https://app.cloopen.com:8883/2013-12-26/Accounts/${accountSID}/SMS/TemplateSMS?sig=${sigParam}`
  const session: ISession = await getIronSession(req, res, IronOptions);
  const varifyCode = Math.floor(Math.random() * 9000) + 1000
  const back = await fetch.post(url,{
      to: phone,
      appId: appID,
      templateId: 1,
      datas: [varifyCode, 2],
    }, {
    headers: {
      Authorization: authorization,
    }
  });
  const {statusCode, templateSMS} = back.data as any;
  console.log("statusCode：", statusCode);
  if (statusCode === '000000') {
    session.varifyCode = varifyCode;
    await session.save();
    console.log("session验证码",session.varifyCode)
    res.status(200).json({
      code: 0,
      msg: '发送成功',
      data: {
        templateSMS,  
      },
    });
  } else {
    res.status(200).json({
      code: statusCode,
      msg: "获取失败",
    });
  }
}
