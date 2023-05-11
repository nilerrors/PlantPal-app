import { useEffect, useState } from "react";
import { Button, TextInput, View } from "react-native";
import { Text } from "../Themed";

type Props = {
  name: string;
  onChangeWifi: () => void;
};

export function ChangeWifi({ name, onChangeWifi }: Props) {
  const [ssid, setSsid] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSsid("plantpal-" + name);
  }, []);

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
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const formData = new FormData();
    formData.append("ssid", ssid);
    formData.append("pass", pass);
    fetch("http://192.168.1.1/api/change_network_ssid_pass", {
      method: "POST",
      body: formData,
      signal: controller.signal,
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((data) => {
        setLoading(false);
        if (data.title == "Successfully Changed") {
          setError(undefined);
          onChangeWifi();
          alert("Device credentials successfully changed");
        } else {
          alert(data.title + ": " + data.message);
        }
        clearTimeout(timeout);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        if (err?.name == "AbortError") {
          setError("Request took too long");
        } else {
          setError(JSON.stringify(err));
        }
        clearTimeout(timeout);
      });
  };

  return (
    <>
      <View style={{ marginVertical: "20%", width: "70%" }}>
        <Text
          style={{ fontSize: 50, textAlign: "center", marginBottom: "10%" }}
        >
          Device Internal Credentials
        </Text>
        {error == undefined ? null : (
          <>
            <Text style={{ fontSize: 20, color: "red" }}>{error}</Text>
            <View style={{ marginVertical: "3%" }}></View>
          </>
        )}
        <Text
          style={{ fontSize: 30 }}
          info="The name of device that will be shown"
        >
          SSID
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
            setSsid(value);
            setError(undefined);
          }}
          value={ssid}
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
            setPass(value);
            setError(undefined);
          }}
          secureTextEntry={true}
          value={pass}
        />
        <View style={{ marginTop: "11%" }}>
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
