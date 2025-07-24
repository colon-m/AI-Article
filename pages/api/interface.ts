import { IronSession } from "iron-session";

export type Data = {
  code: number;
  msg: string;
  data?: any;
};
export type ISession = IronSession<any> & {
  varifyCode?: number;
};