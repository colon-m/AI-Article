import "reflect-metadata";
import type { NextApiRequest, NextApiResponse } from "next";
import getDatabaseConnection from "db/index"
import { getIronSession } from "iron-session";
import type { ISession } from "pages/api/interface";
import { User } from "db/entities/user";
import { UserAuth } from "db/entities/userAuth";
import { IronOptions } from "config/index";
// import { setUser } from "utils/cookiesOp";
import { setCookie } from "cookies-next";

type Iprops = {
    phone: string;
    varify: number;
    identity_type: string;
}
export default async function Login(req: NextApiRequest, res: NextApiResponse) {
    const connection = await getDatabaseConnection();
    const authRep =  connection.getRepository(UserAuth);
    const userRep = connection.getRepository(User);
    const session: ISession = await getIronSession(req, res, IronOptions);
    const { phone, varify,identity_type = 'phone' } = req.body as Iprops;
    console.log('varify',varify)
    if (session.varifyCode == varify) {
        let userAuth = await authRep.findOne({
             where: {
                 identifier: phone,
                 identity_type
             },
             relations: {user: true},
         });
        if (!userAuth) {
            const newUser = new User();
            newUser.nickname = '用户_'+ Math.floor(Math.random() * 10000);
            newUser.avatar = '/images/avatar.png';
            newUser.job = '暂无';
            newUser.introduce = '暂无';
            userAuth = new UserAuth();
            userAuth.identifier = phone;
            userAuth.identity_type = identity_type;
            userAuth.credential = session.verifyCode;
            userAuth.user = newUser;
            const result = await authRep.save(userAuth);
        }
        session.user_id = userAuth.user.id;
        session.nickname = userAuth.user.nickname;
        session.avatar = userAuth.user.avatar;
        session.job = userAuth.user.job;
        session.introduce = userAuth.user.introduce
        await session.save()
        await setCookie("user",JSON.stringify(userAuth.user),{
            maxAge: 24 * 60 * 60,
            req,
            res,
            path:'/'
        })
        res.status(200).json({
            code: 0,
            msg: "登陆成功",
            data: {user:userAuth.user}
        })
    }else {
        res.status(200).json({
            code: 1,
            msg: "验证码错误",
        });
    }

}
