import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tab,
  Tabs,
  TextField,
  Typography,
  Paper,
  ButtonBase,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import HomePage from "./home/HomePage";
import KanbanBoard from "./kanban/KanbanBoard";
import Login from "./Login";
import Users from "./Users";
import IUser from "../interfaces/IUser";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { useAppSelector } from "../store/hooks";

function App() {
  const location = useLocation();
  const history = useHistory();
  const [selectedTab, setSelectedTab] = useState("/");
  const me = useAppSelector((state) => state.me.value);

  useEffect(() => {
    const path = location.pathname.replace(/[\d+\/]/g, "");
    console.log(path);
    setSelectedTab(path);
  }, [location.pathname]);

  function a11yProps(tabGroup: string, id: string) {
    return {
      id: `${tabGroup}-tab-${id}`,
      "aria-controls": `${tabGroup}-tabpanel-${id}`,
    };
  }

  function handleTabChange(value: string) {
    history.push(value);
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        display="flex"
        sx={{
          height: 50,
          width: "100vw",
          borderBottomColor: "grey.200",
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
        }}
      >
        <Box flexGrow={1}>
          <Tabs
            value={selectedTab}
            onChange={(e, v) => handleTabChange(v)}
            aria-label="navigation tabs"
          >
            <Tab label="home" value="" {...a11yProps("nav", "home")} />
            <Tab label="users" value="users" {...a11yProps("nav", "users")} />
            <Tab
              label="kanban"
              value="kanban"
              {...a11yProps("nav", "kanban")}
            />
          </Tabs>
        </Box>
        <Box>
          <ButtonBase>
            <Typography
              sx={{
                lineHeight: "50px",
                mx: 3,
                px: 3,
                "&:hover": {
                  backgroundColor: "green",
                },
              }}
            >
              {me?.first_name} {me?.last_name}
            </Typography>
          </ButtonBase>
        </Box>
      </Box>
      <Login>
        <Box
          sx={{
            height: "calc(100vh - 50px)",
            p: 2,
            overflow: "auto",
          }}
        >
          {/* <Paper sx={{ p: 2 }}> */}
          <Switch>
            <Route exact path="/">
              <HomePage />
            </Route>
            <Route path="/kanban/:id">
              <KanbanBoard />
            </Route>
            <Route path="/users">
              <Users />
            </Route>
            <Route path="*">
              <h1>Yikes! No page found here...</h1>
            </Route>
          </Switch>
          {/* </Paper> */}
        </Box>
      </Login>
    </LocalizationProvider>
  );
}

export default App;
