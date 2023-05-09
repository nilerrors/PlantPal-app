import { useEffect, useState, useContext, createContext } from "react";
import { API_URL } from "../constants/Api";
import {
  getAccount,
  removeAccount,
  setAccount,
} from "../utils/accountCredentials";

export type Account = {
  email: string | null;
  pass: string | null;
};

export type AccountExtended = {
  loading: boolean;
  user: Account;
  isSetupDone: boolean;
  set: (email: string, pass: string) => Promise<{ res: Response; data: any }>;
  logout: () => Promise<void>;
};

export const AccountContext = createContext<AccountExtended>(
  {} as AccountExtended
);

export function useAccount() {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error("Account Context used outside of provider");
  }
  return context;
}

export function AccountContextProvider(props: {
  children: JSX.Element[] | JSX.Element;
}): JSX.Element {
  const [account, setAccountData] = useState<Account>({} as Account);
  const [isSetupDone, setIsSetupDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function set(
    email: string,
    pass: string
  ): Promise<{ res: Response; data: any }> {
    setLoading(true);
    const controller = new AbortController();
    try {
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(API_URL + "/auth/login", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password: pass,
          remember: true,
        }),
      });
      clearTimeout(timeout);
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        return Promise.reject(data.detail ?? data.message ?? "Error");
      }

      await setAccount(email, pass);
      await setAccountData({
        email,
        pass,
      });

      return { res, data };
    } catch (err) {
      setLoading(false);
      return Promise.reject(err);
    }
  }

  async function logout() {
    setLoading(true);
    removeAccount()
      .then(() => {
        getAccount()
          .then((a) => setAccountData(a))
          .catch((err) => {
            setLoading(false);
            console.log(err);
          });
        setLoading(false);
        console.log("removed");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  useEffect(() => {
    setLoading(true);
    getAccount()
      .then((a) => {
        setAccountData(a);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, []);

  useEffect(() => {
    setIsSetupDone(account.email != null && account.pass != null);
    console.log(
      "account changed",
      account.email != null && account.pass != null
    );
    console.log(JSON.stringify(account));
  }, [account]);

  return (
    <AccountContext.Provider
      value={{
        loading,
        isSetupDone,
        user: account,
        set,
        logout,
      }}
    >
      {props.children}
    </AccountContext.Provider>
  );
}

// export function useAccount(): AccountExtended {
//   const [account, setAccountData] = useState<Account>({} as Account);
//   const [isSetupDone, setIsSetupDone] = useState(false);
//   const [loading, setLoading] = useState(false);

//   async function set(
//     email: string,
//     pass: string
//   ): Promise<{ res: Response; data: any }> {
//     setLoading(true);
//     const res = await fetch(API_URL + "/auth/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         email,
//         password: pass,
//         remember: true,
//       }),
//     });
//     const data = await res.json();
//     setLoading(false);
//     if (!res.ok) {
//       return Promise.reject(data.detail ?? data.message ?? "Error");
//     }

//     setAccount(email, pass);
//     setAccountData({
//       email,
//       pass,
//     });

//     return { res, data };
//   }

//   async function logout() {
//     setLoading(true);
//     removeAccount()
//       .then(() => {
//         getAccount()
//           .then((a) => setAccountData(a))
//           .catch((err) => {
//             setLoading(false);
//             console.log(err);
//           });
//         console.log("removed");
//       })
//       .catch((err) => {
//         console.log(err);
//         setLoading(false);
//       });
//   }

//   useEffect(() => {
//     setLoading(true);
//     getAccount()
//       .then((a) => {
//         setAccountData(a);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setLoading(false);
//         console.log(err);
//       });
//   }, []);

//   useEffect(() => {
//     setIsSetupDone(account.email != null && account.pass != null);
//     console.log(
//       "account changed",
//       account.email != null && account.pass != null
//     );
//     console.log(JSON.stringify(account));
//   }, [account]);

//   return {
//     loading,
//     isSetupDone,
//     user: account,
//     set,
//     logout,
//   };
// }
