import { TextInput, View } from "react-native";
import { Text } from "../Themed";
import SelectDropdown from "react-native-select-dropdown";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNetwork } from "../../contexts/NetworkContext";

export function CustomDeviceCredentials() {
  const {
    allNetworks,
    checkNetworkAvailability: refetchNetworks,
    wifi: network,
    setWifi: setNetwork,
  } = useNetwork();
  return (
    <View style={{ marginVertical: "20%", width: "70%" }}>
      <Text style={{ fontSize: 30 }} info="The name of device to connect to">
        SSID
      </Text>
      <SelectDropdown
        data={allNetworks.map((n) => n.SSID)}
        onSelect={(value) => {
          setNetwork({ ...network, ssid: value });
          refetchNetworks();
        }}
        buttonStyle={{
          borderRadius: 5,
          borderColor: "white",
          backgroundColor: "#7393B3",
          width: "100%",
          margin: 0,
        }}
        defaultValue={network.ssid ?? ""}
        renderDropdownIcon={(isOpened) => {
          return (
            <FontAwesome
              name={isOpened ? "chevron-up" : "chevron-down"}
              color={"#444"}
              size={18}
            />
          );
        }}
        buttonTextStyle={{
          color: "white",
        }}
        rowStyle={{
          borderColor: "white",
          backgroundColor: "#7393B3",
        }}
      />
      <View style={{ marginVertical: "2%" }}></View>
      <Text style={{ fontSize: 30 }} info="The password to connect to device">
        Password
      </Text>
      <TextInput
        style={{
          borderColor: "white",
          borderWidth: 1,
          paddingHorizontal: 5,
          width: "100%",
          height: 30,
          color: "white",
          fontSize: 30,
        }}
        onChangeText={(value) => {
          setNetwork({ ...network, pass: value });
        }}
        secureTextEntry={true}
        value={network.pass}
      />
    </View>
  );
}
