import { useContext, createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  LOGIN_POST,
  REGISTER_POST,
  API_SERVER,
  CHECK_AUTH,
} from '@/components/config/api-path';

const AuthContext = createContext();
const emptyAuth = {
  id: 0,
  email: '',
  password: '',
  token: '',
};

export function AuthContextProvider({ children }) {
  const [rerender, setRerender] = useState(false);

  const [auth, setAuth] = useState(emptyAuth);
  const router = useRouter();
  const [loginModalToggle, setLoginModalToggle] = useState(false);
  const [userAvatar, setUserAvatar] = useState(
    `${API_SERVER}/avatar/defaultAvatar.jpg`
  );
  const [isOnLogin, setIsOnLogin] = useState(true);

  const storageKey = 'TD_auth';

  const switchHandler = () => {
    setIsOnLogin(!isOnLogin);
  };

  const register = async (email, validCode, username, password) => {
    try {
      const r = await fetch(REGISTER_POST, {
        method: 'POST',
        body: JSON.stringify({ email, validCode, username, password }),
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await r.json();
      console.log('register:', result);
      return result;
    } catch (error) {
      console.error('註冊時發生錯誤', error);
      return { success: false, error: '註冊時發生錯誤' };
    }
  };

  const tryClick = async () => {
    console.log('click!');
  };

  const login = async (email, password) => {
    const r = await fetch(LOGIN_POST, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await r.json();

    if (result.success) {
      localStorage.setItem(storageKey, JSON.stringify(result.data));
      setAuth(result.data);
    }

    console.log(result);
    return result;
    // } else {
    //   console.error(result.error);
    //   throw new Error(result.error);
    // }
  };

  const logout = async () => {
    router.push('/');
    localStorage.removeItem(storageKey);
    setAuth(emptyAuth);
  };

  const getAuthHeader = () => {
    if (auth.token) {
      return { Authorization: 'Bearer ' + auth.token };
    }
  };

  //做授權測試，返回值:
  //1.沒此ID {
  //     status: 'error',
  //     error: '無授權token，請進行登入',
  //     success: false,
  //     msg: '無授權token，請進行登入',
  // }
  // 2.授權成功:{success: true, msg:'確認成功，有Token，UserID也符合'}
  const checkAuth = async (sid) => {
    const r = await fetch(`${CHECK_AUTH}/?sid=${sid}`, {
      method: 'GET',
      headers: { ...getAuthHeader(), 'content-type': 'application/json' },
    });
    const result = await r.json();
    return result;
  };

  useEffect(() => {
    const str = localStorage.getItem(storageKey);
    try {
      const data = JSON.parse(str);
      if (data) {
        setAuth(data);
      }
    } catch (ex) {
      console.log(ex);
    }
  }, []);

  // useEffect(() => {
  //   console.log('在AUTH-CONTEXT的 rerender 狀態:', rerender);
  // }, [rerender]); // 確保這裡的依賴數組包含 rerender 狀態

  return (
    <AuthContext.Provider
      value={{
        tryClick,
        storageKey,
        auth,
        checkAuth,
        setAuth,
        register,
        login,
        logout,
        getAuthHeader,
        loginModalToggle,
        setLoginModalToggle,
        userAvatar,
        setUserAvatar,
        switchHandler,
        isOnLogin,
        setIsOnLogin,
        rerender,
        setRerender,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
