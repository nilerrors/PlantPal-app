import WifiManager from "react-native-wifi-reborn";
import { useEffect, useState } from "react";
import { Button, TextInput, View } from "react-native";
import { Checkbox } from "expo-checkbox";
import SelectDropdown from "react-native-select-dropdown";
import { Text } from "../Themed";
import { FontAwesome } from "@expo/vector-icons";
import { useAccount } from "../../contexts/AccountContext";

type Props = {
  onCreatePlant?: (id: string) => void;
};
// TODO; finish this form
// After that add a form for network name change
export function CreatePlant({ onCreatePlant }: Props) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [saveForNext, setSaveForNext] = useState(true);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [isDeviceConnected, setIsDeviceConnected] = useState<boolean>(false);

  const { user } = useAccount();

  useEffect(() => {
    setEmail(user.email ?? "");
    setPass(user.pass ?? "");
  }, []);

  const handleSubmit = () => {
    if (email == "") {
      setError("No value given for SSID");
      return;
    }
    if (pass == "") {
      setError("No value given for Password");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("pass", pass);
    fetch("http://8.8.8.8/api/create_plant", {
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
        <Text
          style={{ fontSize: 50, textAlign: "center", marginBottom: "10%" }}
        >
          Create Plant
        </Text>
        {error == undefined ? null : (
          <>
            <Text style={{ fontSize: 20, color: "red" }}>{error}</Text>
            <View style={{ marginVertical: "3%" }}></View>
          </>
        )}
        <Text style={{ fontSize: 30 }}>Email</Text>
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
          value={email}
        />
        <View style={{ marginVertical: "2%" }}></View>
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
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Checkbox
            value={saveForNext}
            onValueChange={() => {
              setSaveForNext((v) => !v);
            }}
            color={"#5599ff"}
            style={{ marginVertical: "3%", marginRight: "3%" }}
          />
          <Text style={{ fontSize: 15 }}>Save For Later</Text>
        </View>
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
