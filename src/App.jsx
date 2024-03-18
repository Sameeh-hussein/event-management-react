import { RouterProvider } from "react-router-dom";
import { Router } from "./Routes";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const defaultTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#283593",
    },
    navBarColor: {
      main: "#ffffff",
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <RouterProvider router={Router} />
    </ThemeProvider>
  );
}
