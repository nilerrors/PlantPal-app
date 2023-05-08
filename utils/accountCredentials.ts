import * as SecureStore from "expo-secure-store";

export type Account = {
  email: string | null;
  pass: string | null;
};

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

export async function removeAccount() {
  await SecureStore.deleteItemAsync("PlantPalAccountEmail");
  await SecureStore.deleteItemAsync("PlantPalAccountPass");
}
