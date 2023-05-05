import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { API_URL } from "../constants/Api";

export type Account = {
  email?: string | null;
  pass?: string | null;
};

export type AccountExtended = {
  isAccountCreated?: boolean;
  user: {
    email?: string | null;
    pass?: string | null;
  };
  set: (email: string, pass: string) => Promise<{ res: Response; data: any }>;
};

export function useAccount() {
  const [account, setAccountData] = useState<Account>({} as Account);

  async function set(
    email: string,
    pass: string
  ): Promise<{ res: Response; data: any }> {
    const res = await fetch(API_URL + "/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password: pass,
        remember: true,
      }),
    });

    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
    if (!res.ok) {
      return Promise.reject(data.detail ?? data.message ?? "Error");
    }

    setAccount(email, pass);
    setAccountData({
      email,
      pass,
    });

    return { res, data };
  }

  useEffect(() => {
    getAccount()
      .then((a) => setAccountData(a))
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return {
    isAccountCreated:
      account.email === undefined && account.pass === undefined
        ? undefined
        : account.email != null && account.pass != null,
    user: {
      email: account.email,
      pass: account.pass,
    },
    set,
  };
}

export async function getAccount(): Promise<Account> {
  const account: Account = {} as Account;
  account.email = await SecureStore.getItemAsync("PlantPalAccountEmail");
  account.pass = await SecureStore.getItemAsync("PlantPalAccountPass");

  return account;
}

export async function setAccount(email: string, pass: string) {
  await SecureStore.setItemAsync("PlantPalAccountEmail", email);
  await SecureStore.setItemAsync("PlantPalAccountPass", pass);
}
