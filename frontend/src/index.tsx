import { CssBaseline } from "@mui/material";
import { ThemeProvider, useTheme } from "@mui/system";
import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./components/App";
import "./index.css";
import { getTheme } from "./theme/theme";

render(
  <Router>
    <ThemeProvider theme={getTheme()}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </Router>,
  document.getElementById("app")
);
