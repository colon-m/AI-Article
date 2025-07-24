import { NextApiRequest,NextApiResponse } from "next"
interface Iuser{
    id: number,
    nickname: string,
    avatar: string
}

export const setUser = (cookies: any, user: Iuser, req:NextApiRequest, res:NextApiResponse) =>{
    const config = {
        maxAge: 24 * 60 * 60,
        req,
        res,
        path:'/'
    }
    cookies.setCookie("user",JSON.stringify(user),config)
}