import styles from "./index.module.scss";
import { useState } from "react";
import CountDown from "components/CountDown";
import fetch from "service/fetch";
import { useStore } from "store";
import { observer } from "mobx-react-lite";

interface LoginProps {
  isLogin: boolean,
  onClose: () => void
}
interface Iresponse {
  code: number;
  msg: string;
  data?: any;
}

const Login = ({  isLogin, onClose }: LoginProps) => {
  const store = useStore()
  const [form, setForm] = useState({
    phone: "",
    varify: ""
  });
  const [isShowVarify, setIsShowVarify] = useState(false);

  const handleClose = () => {
    console.log("关闭登录框");
    onClose();
  };
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };
  const handleCountDown = () => {

  };
  const handleGetVarify = async() => {
    // setIsShowVarify(true);
    if (!form.phone) {
      alert("请输入手机号");
      return;
    }
    const response: Iresponse = await fetch.post('/api/user/getVarify', { phone: form.phone });
    console.log("获取验证码结果", response);
    const { code, msg } = response.data;
    if(code !== 0) {
      alert(msg);
      return;
    }
  };
  const handleLogin = async() => {
    if (!form.phone || !form.varify) {
      alert("手机号和验证码不能为空");
      return;
    }
    const response: Iresponse = await fetch.post('/api/user/login', {...form,identity_type: 'phone'});
    console.log("登录结果", response);
    const { code, msg, data } = response.data;
    if (Number(code) === 0) {
      alert("登录成功");
      //存储用户信息
      store.userStore.setUserInfo(data.user);
      store.viewedArticlesStore.modefyUser(data.user);
      // await store.viewedArticlesStore.initiateRecords();
      onClose && onClose();
    } else {
      alert(msg);
    }
  };
  const handleGithubLogin = async() =>{
    //Client secret: 07df420dd33fd66b1e086f63f1ea6dcd79f87e86
    // Client ID: Iv23liuoBZhXWq2TViMw
    // App ID: 1630094
    const client_id = "Iv23liuoBZhXWq2TViMw"
    const url = `https://github.com/login/oauth/authorize?client_id=${client_id}`
    window.open(url)
  }
  return isLogin ? (
    <div className={styles.mask}>
      <div className={styles.box}>
        <div className={styles.title}>
          <span>手机号登陆</span>
          <div className={styles.close} onClick={handleClose}>X</div>
        </div>
        <div className={styles.inputArea}>
          <input name="phone" type="text" placeholder="手机号" value={form.phone} onChange={handleFormChange} />
          <div className={styles.varify}>
            <input name="varify" type="text" placeholder="验证码" value={form.varify} onChange={handleFormChange} />
            <span className={styles.getVarify}>
              {isShowVarify ? <CountDown time={10} onEnd={handleCountDown}/> : <span onClick={handleGetVarify}>获取验证码</span>}
            </span>
          </div>
        </div>
        <button className={styles.submit} onClick={handleLogin}>登录</button>
        <div className={styles.others}>
          <span className={styles.githubLogin} onClick={handleGithubLogin}>使用Github登录</span>
          <div className={styles.privacy}>
            注册登录即同意我们的
            <a href="https://www.huawei.com/cn/privacy-policy/" target="_blank">隐私政策</a>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
export default observer(Login);