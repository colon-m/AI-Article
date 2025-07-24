import type { NextApiRequest, NextApiResponse } from "next";
import getDatabaseConnection from "db/index"
import { getIronSession } from "iron-session";
import type { ISession } from "pages/api/interface";
import { User } from "db/entities/user";
import { UserAuth } from "db/entities/userAuth";
import { UserGitMapper } from "db/entities/userGitMapper";
import { IronOptions } from "config/index";
import { setCookie } from "cookies-next";
import fetch from "service/fetch";

export default async function Redirect(req: NextApiRequest, res: NextApiResponse){
    const session:ISession = await getIronSession(req,res,IronOptions);

    const {code} = req?.query || {};
    console.log("code:",code);

    //Client secret: 07df420dd33fd66b1e086f63f1ea6dcd79f87e86
    // Client ID: Iv23liuoBZhXWq2TViMw
    // App ID: 1630094
    const client_id = "Iv23liuoBZhXWq2TViMw";
    const client_secret = "07df420dd33fd66b1e086f63f1ea6dcd79f87e86";
    const url = `https://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${code}`;
    const result = await fetch.post(url,{},{
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/vnd.github+json'
        }
    });
    console.log("result:",result)
    const {access_token} = result as any;

    const gitInfo = await fetch.get("https://api.github.com/user",{
        headers:{
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${access_token}`, 
        }
    })
    console.log("userInfo:",gitInfo);

    const {id} = gitInfo as any;
    const db = await getDatabaseConnection();
    const authRep = db.getRepository(UserAuth);
    const mapperRep = db.getRepository(UserGitMapper);
    let userAuthGO = await mapperRep.findOne({
        where:{
            github_id: id
        },
        relations:{
            user:true
        }
    }) as any;
    console.log("userAuth:",userAuthGO)

    if(!userAuthGO){
        const user = new User();
        user.nickname = '用户_'+ Math.floor(Math.random() * 10000);
        user.avatar = '/images/avatar.png';
        user.job = '暂无';
        user.introduce = '暂无';
        const userAuth = new UserAuth();
        userAuth.identifier = client_id;
        userAuth.identity_type = "github";
        userAuth.credential = access_token;
        userAuth.user = user;
        const mapper = new UserGitMapper();
        mapper.github_id = id;
        mapper.user = userAuth.user;
        await authRep.save(userAuth);
        await mapperRep.save(mapper); 
        userAuthGO = userAuth;
    }else{
        userAuthGO.credential = access_token;
    }
    session.user_id = userAuthGO.user.id;
    session.nickname = userAuthGO.user.nickname;
    session.avatar = userAuthGO.user.avatar;
    session.job = userAuthGO.user.job;
    session.introduce = userAuthGO.user.introduce
    await session.save()
    await setCookie("user",JSON.stringify(userAuthGO.user),{
        maxAge: 24 * 60 * 60,
        req,
        res,
        path:'/'
    })
    res.redirect(307, '/'); 
}