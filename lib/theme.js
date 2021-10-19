import { mode } from '@chakra-ui/theme-tools';
import { extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const styles = {
  global: props => ({
    body: {
      color: mode('#212121', '#FBFAF8')(props), // text color (light mode, dark mode)
      bg: mode('#FBFAF8', '#212121')(props), // background color (light mode, dark mode)
    },
  }),
};

const colors = {
  primary: "#4E89AE",
  primary2: "#43658B",
  secondary: "#F7A440",
  secondary2: "#F58634",
  error: "#FF5C58",
  text: {
    onLight: "#212121",
    onDark: "#FBFAF8",
    onPrimary: "#EEEEEE",
    onSecondary : "#212121",
    onError: "#EEEEEE",
  },
  bg: {
    light: "#FBFAF8",
    dark: "#212121",
  }
};

const fonts = {
  body: "Mukta, system-ui, sans-serif",
  heading: "Mukta, system-ui, sans-serif",
  mono: "Menlo, monospace",
};

const theme = extendTheme({ 
  config, 
  styles,
  colors,
  fonts, 
});

export default theme;