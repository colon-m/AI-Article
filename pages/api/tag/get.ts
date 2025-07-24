import type { NextApiRequest, NextApiResponse } from "next";
import getDatabaseConnection from "db/index"
import { User,Article,Tag } from "db/entities";
import { getIronSession } from "iron-session";
import type { ISession } from "pages/api/interface";
import { IronOptions } from "config/index";


export default async function Publish(req: NextApiRequest, res: NextApiResponse){
    const session: ISession = await getIronSession(req,res,IronOptions);
    const db = await getDatabaseConnection();
    const {user_id = 0} = session;
    const userRep = db.getRepository(User);
    const tagRep = db.getRepository(Tag);
    const followTags = await tagRep.find({
        relations: ["users"],
        where: {
            users: {
                id: Number(user_id)
            }
        }
    })
    const allTags = await tagRep.find({
        relations: ["users"],
    })

    res.status(200).json({
        code: 0,
        msg: '',
        data:{
            followTags,
            allTags
        }
    })
}