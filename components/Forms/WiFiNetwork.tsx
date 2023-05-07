import WifiManager from "react-native-wifi-reborn";
import { useState } from "react";
import { Button, TextInput, View } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { Text } from "../Themed";
import { FontAwesome } from "@expo/vector-icons";

type Props = {
  allNetworks: WifiManager.WifiEntry[];
  refetchNetworks: () => void;
  onDeviceConnect?: () => void;
};

export function WiFiNetwork({
  allNetworks,
  refetchNetworks,
  onDeviceConnect,
}: Props) {
  const [ssid, setSsid] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [isDeviceConnected, setIsDeviceConnected] = useState<boolean>(false);

  const handleSubmit = () => {
    if (ssid == "") {
      setError("No value given for SSID");
      return;
    }
    if (pass == "") {
      setError("No value given for Password");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("ssid", ssid);
    formData.append("pass", pass);
    fetch("http://8.8.8.8/api/change_wifi", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((data) => {
        setLoading(false);
        if (data.title == "Connection Successful") {
          setError(undefined);
          setIsDeviceConnected(true);
          onDeviceConnect?.();
          alert("Device is connected to network");
        } else {
          alert(data.title + ": " + data.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        setError(JSON.stringify(err));
      });
  };

  return (
    <>
      <View style={{ marginVertical: "20%", width: "70%" }}>
        {error == undefined ? null : (
          <>
            <Text style={{ fontSize: 20, color: "red" }}>{error}</Text>
            <View style={{ marginVertical: "3%" }}></View>
          </>
        )}
        <Text style={{ fontSize: 30 }}>Network SSID</Text>
        <SelectDropdown
          data={allNetworks.map((n) => n.SSID)}
          onFocus={refetchNetworks}
          onSelect={(s) => {
            setSsid(s);
            setError(undefined);
          }}
          buttonStyle={{
            borderRadius: 5,
            borderColor: "white",
            backgroundColor: "gray",
            width: "100%",
            margin: 0,
          }}
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
            backgroundColor: "gray",
          }}
        />
        <View style={{ marginVertical: "3%" }}></View>
        <Text style={{ fontSize: 30 }}>Password</Text>
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
            setPass(value);
            setError(undefined);
          }}
          secureTextEntry={true}
          value={pass}
        />
        {
          // TODO: add checkbox to save these values
        }
        <View style={{ marginTop: "20%" }}>
          <Button
            title={loading ? "Loading..." : "Submit"}
            onPress={() => handleSubmit()}
            disabled={loading}
          />
        </View>
      </View>
    </>
  );
}
