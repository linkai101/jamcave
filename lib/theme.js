import { mode } from '@chakra-ui/theme-tools';
import { extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const styles = {
  global: props => ({
    body: {
      color: mode('#323232', '#fbfaf8')(props), // text color (light mode, dark mode)
      bg: mode('#fbfaf8', '#323232')(props), // background color (light mode, dark mode)
    },
  }),
};

const colors = {
  primary: "#66FCF1",
  primary2: "#45A29E",
  secondary: "#",
  secondary2: "#",
  error: "",
  text: {
    onPrimary: "#EEEEEE",
    onSecondary : "#EEEEEE",
    onError: "#EEEEEE",
  },
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