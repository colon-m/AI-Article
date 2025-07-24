import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { StoreProvider } from "@/store";
import Layout from "@/components/Layout";
import { getCookie } from "cookies-next";
import { NextPage } from "next";

interface Iprops {
  initValue: Record<any,any>,
  Component: NextPage,
  pageProps: any
}
export default function App({initValue, Component, pageProps }: Iprops) {
  const render = ()=>{
    if((Component as any).isShowLayout === false){
      return <Component {...pageProps} />
    }else{
      return (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )
    }

  }
  return (
    <StoreProvider initValue={initValue}>
        {render()}
    </StoreProvider>
  );
}

App.getInitialProps = async ({ctx}:{ctx:any})=>{
  const {user} = ctx.req?.cookies || {}
  const initValue = {
    user: {
      userInfo: user && JSON.parse(user)
    }
  }
  return {initValue}
}