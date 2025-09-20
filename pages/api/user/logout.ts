import { NextApiRequest,NextApiResponse } from "next";
import { getIronSession,IronSession } from "iron-session";
import { IronOptions } from "config/index";
import { cookies } from "next/headers";
import { deleteCookie } from "cookies-next";

export default async function Logout (req: NextApiRequest, res: NextApiResponse) {
    const session = await getIronSession(req, res, IronOptions);

    session.destroy()
    await deleteCookie('user',{req,res})
    res.status(200).json({
        code: 0,
        msg: '退出成功'
    })
}