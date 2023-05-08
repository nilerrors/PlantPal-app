import { Button, TextInput } from "react-native";
import { View, Text } from "./Themed";
import { useRef, useState } from "react";
import { useAccount } from "../contexts/AccountContext";

export function SetupPage() {
  const { set: setAccount } = useAccount();
  const passInput = useRef<TextInput>({} as TextInput);

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [errorLogin, setErrorLogin] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (email == "") {
      setErrorLogin("Email should be provided");
      return;
    }
    if (pass == "") {
      setErrorLogin("Password should be provided");
      return;
    }
    setLoading(true);
    setAccount(email, pass)
      .then(({ res, data }) => {
        console.log(JSON.stringify(res));
        console.log(JSON.stringify(data));
        setLoading(false);
      })
      .catch((err) => {
        setErrorLogin(JSON.stringify(err));
        setLoading(false);
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginVertical: "8%", marginHorizontal: "5%" }}>
        <Text style={{ fontSize: 50, fontWeight: "bold" }}>Welcome!</Text>
        <View style={{ marginVertical: "20%", marginHorizontal: "10%" }}>
          {errorLogin == undefined ? null : (
            <>
              <Text style={{ fontSize: 20, color: "red" }}>{errorLogin}</Text>
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
            onSubmitEditing={() => passInput.current.focus()}
            keyboardType="email-address"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              setErrorLogin(undefined);
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
            ref={passInput}
            onChangeText={(value) => {
              setPass(value);
              setErrorLogin(undefined);
            }}
            onSubmitEditing={() => handleLogin()}
            secureTextEntry={true}
            value={pass}
          />
          <View style={{ marginTop: "20%" }}>
            <Button
              title={loading ? "Loading..." : "Submit"}
              onPress={() => handleLogin()}
              disabled={loading}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
