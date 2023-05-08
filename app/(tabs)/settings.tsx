import { Alert, Button, StyleSheet } from "react-native";
import * as Linking from "expo-linking";

import { Text, View } from "../../components/Themed";
import { useAccount } from "../../contexts/AccountContext";

export default function Settings() {
  const { logout } = useAccount();

  return (
    <View style={styles.container}>
      <View style={{ width: "80%", top: "7%", position: "absolute" }}>
        <Text style={styles.title}>About</Text>
        <Text>
          This app functions as an interface between the client and the PlantPal
          device.
        </Text>
        <Text>This app can be used to configure the PlantPal device.</Text>
        <View style={{ marginVertical: "2%" }} />
        <Text>It can do the following:</Text>
        <Text>* Change network credentials</Text>
        <Text>* Add plant(-device) to account</Text>
        <View style={{ marginVertical: "6%" }} />
        <Button
          title="Post an issue or a bug"
          color={"#333"}
          onPress={() => {
            Linking.openURL(
              "https://github.com/nilerrors/PlantPal-app/issues/new"
            );
          }}
        />
      </View>
      <Text></Text>
      <View style={styles.end}>
        <Button
          title="Logout from this device"
          color="red"
          onPress={() => {
            Alert.alert(
              "Logout from this device",
              "Are you sure you want to logout from this device?",
              [
                {
                  text: "Yes",
                  onPress: () => {
                    logout();
                  },
                },
                { text: "No", onPress: () => {} },
              ]
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  end: {
    bottom: "5%",
    position: "absolute",
    width: "60%",
  },
});
