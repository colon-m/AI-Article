import "@/styles/globals.css";
import { StoreProvider } from "@/store";
import { NextPage } from "next";
import fetch from "service/fetch";
import MyApp from "components/MyApp";
import type { IrecordInfo } from "store/viewArticlesStore";
import 'highlight.js/styles/rainbow.css';
import 'katex/dist/katex.min.css';


interface Iprops {
  initValue: any,
  Component: NextPage,
  pageProps: any
}
export default function App({initValue, Component, pageProps }: Iprops) {
  return (
    <StoreProvider initValue={initValue}>
        <MyApp Component={Component} pageProps={pageProps} />
    </StoreProvider>
  );
}

App.getInitialProps = async ({ctx}:{ctx:any})=>{
  const {user} = ctx.req?.cookies || {};
  let viewedRecords:IrecordInfo[] = [];
  if(user && user?.id){
    await fetch.get(`/api/record/getViewedArticles?userId=${user.id}`).then((res:any)=>{
      viewedRecords = res.data.articles || [];
    });
  }
  const initValue = {
    user: {
      userInfo: user && JSON.parse(user)
    },
    viewedArticles:{
      records: viewedRecords,
      user: user && JSON.parse(user)
    }
  }
  return {initValue}
}