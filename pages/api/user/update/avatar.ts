import { NextApiRequest,NextApiResponse } from "next";
import { getIronSession } from "iron-session";
import { IronOptions } from "config";
import getDatabaseConnection from "db";
import { ISession } from "../../interface";
import { User } from "db/entities";
import {EXCEPTION_USER} from "../../exception.config"

export default async function updateAvatar(req:NextApiRequest, res: NextApiResponse){
    const {imageUrl} = req.body;
    const session: ISession = await getIronSession(req, res, IronOptions);
    const uid = session.user_id;
    const db = await getDatabaseConnection();
    const userRep = db.getRepository(User);
    const user = await userRep.findOneBy({
        id: uid
    })
    if(user){
        user.avatar = imageUrl;
        await session.save();
        await userRep.save(user);
        res.status(200).json({
            code: 0,
            msg: "",
        })
    }
    else{
        res.status(200).json(EXCEPTION_USER.NOTFOUND)
    }
    
}