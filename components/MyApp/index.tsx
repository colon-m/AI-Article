import { NextPage } from "next";
import { useStore } from "store";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import Layout from "@/components/Layout";
import { AiChat } from "components/AiChat";
interface Iprops {
  Component: NextPage,
  pageProps: any
}
const MyApp = ({ Component, pageProps }: Iprops) => {
    const {userStore,viewedArticlesStore} = useStore();
    useEffect(()=>{
      viewedArticlesStore.initiateRecords();
    }, [userStore.userInfo]);
    if((Component as any).isShowLayout === false){
      return (
        <>
          <Component {...pageProps} />
          <AiChat/>
        </>)
    }else{
      return (
        <Layout showSideCard={(Component as any).ShowSideCard !== false}>
          <>
            <Component {...pageProps} />
            <AiChat/>
          </>
        </Layout>
      )
    }
};

export default observer(MyApp);
