import type { NextApiRequest, NextApiResponse } from "next";
import getDatabaseConnection from "db/index"
import { User,Article,Tag } from "db/entities";
import { getIronSession } from "iron-session";
import type { ISession } from "pages/api/interface";
import { IronOptions } from "config/index";
import { EXCEPTION_TAG,EXCEPTION_USER } from "../exception.config";


export default async function Publish(req: NextApiRequest, res: NextApiResponse){
    const {id,type} = req.body;
    const session: ISession = await getIronSession(req,res,IronOptions);
    const db = await getDatabaseConnection();
    const {user_id = 0} = session;
    const userRep = db.getRepository(User);
    const tagRep = db.getRepository(Tag);
    const tag = await tagRep.findOne({
        where:{
            id
        },
        relations:["users"]
    });
    const user = await userRep.findOne({
        where:{
            id: user_id
        }

    })
    if(tag==null){
        res.status(200).json({...EXCEPTION_TAG.NOTFOUND})
        return
    }
    if(user==null){
         res.status(200).json({...EXCEPTION_USER.NOTFOUND})
         return
    }
    if(type === "follow"){
        tag.users = tag.users.concat({...user})
    }
    if(type === "unfollow"){
        tag.users = tag.users.filter((user)=>user.id!==user_id)
    }
    await tagRep.save(tag)
    res.status(200).json({
        code: 0,
        msg:"成功"
    })
}