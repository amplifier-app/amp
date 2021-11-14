import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Video from "./VideoComponents/Video/Video";
import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import BrowserUnsupported from "./VideoComponents/BrowserUnsupported/BrowserUnsupported";
import DailyIframe from "@daily-co/daily-js";
import { Provider } from "react-redux";
import store from "../store/index";
import DashboardRoutes from "./Dashboard/DashboardRoutes";
import "@fontsource/poppins";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ffba01",
      contrastText: "#fff",
    },
  },
  typography: {
    fontFamily: "Poppins",
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    ToggleButtonGroup: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    ToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
  },
});

export default function App() {
  return (
    <>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          <BrowserRouter>
            <Switch>
              <Route
                exact
                path="/"
                component={
                  DailyIframe.supportedBrowser().supported
                    ? Video
                    : BrowserUnsupported
                }
              />
              <Route path="/" component={DashboardRoutes} />
              <Route path="/contact" render={() => <h1>Contact Us</h1>} />
              <Route path="*" render={() => <h2>Page not found</h2>} />
            </Switch>
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    </>
  );
}
