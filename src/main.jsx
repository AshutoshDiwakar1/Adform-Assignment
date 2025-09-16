import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import App from "./App";
import { store } from "./store";

const theme = createTheme({
  palette: {
    mode: "light",
  },
});

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
