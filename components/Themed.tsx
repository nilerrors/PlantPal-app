/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
  Text as DefaultText,
  useColorScheme,
  View as DefaultView,
  TextInput as DefaultTextInput,
} from "react-native";

import Colors from "../constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type TextInputProps = ThemeProps & DefaultTextInput["props"];

export function Text(props: TextProps & { info?: string }) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <DefaultText style={[{ color, flex: 1 }, style]} {...otherProps} />
      {props.info === undefined ? null : (
        <FontAwesome
          color={color}
          name="info-circle"
          size={20}
          style={{
            alignSelf: "flex-end",
            padding: "1%",
            margin: "0%",
          }}
          onPress={() => {
            alert(props.info);
          }}
        />
      )}
    </View>
  );
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function TextInput(props: TextInputProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <DefaultTextInput style={[{ backgroundColor }, style]} {...otherProps} />
  );
}
