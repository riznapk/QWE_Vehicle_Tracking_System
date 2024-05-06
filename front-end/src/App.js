import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import store from "./redux/store";
import AppRouter from "./components/AppRouter";
import { useEffect } from "react";
import GetDataService, { getVehicleDetails } from "./services/getDataService";
import { TimeOut } from "./components/TimeOut";

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#FFB52E",
      },
      secondary: {
        main: "#FFB52E",
        dark: "#ED6B5B",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <BrowserRouter>
          <AppRouter />
          <GetDataService />
          <TimeOut />
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
