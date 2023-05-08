import * as SecureStore from "expo-secure-store";

type Network = {
  ssid: string | null;
  pass: string | null;
};

export async function getNetwork() {
  const network: Network = {} as Network;
  network.ssid = await SecureStore.getItemAsync("PlantPalNetworkSsid");
  network.pass = await SecureStore.getItemAsync("PlantPalNetworkPass");

  return network;
}

export async function setNetwork(ssid: string, pass: string) {
  await SecureStore.setItemAsync("PlantPalNetworkSsid", ssid);
  await SecureStore.setItemAsync("PlantPalNetworkPass", pass);
}
