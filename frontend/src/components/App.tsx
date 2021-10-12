import { Box, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import HomePage from "./home/HomePage";
import KanbanBoard from "./kanban/KanbanBoard";

function App() {
  const history = useHistory();
  const [selectedTab, setSelectedTab] = useState("/");

  function a11yProps(tabGroup: string, id: string) {
    return {
      id: `${tabGroup}-tab-${id}`,
      "aria-controls": `${tabGroup}-tabpanel-${id}`,
    };
  }

  function handleTabChange(value: string) {
    setSelectedTab(value);
    history.push(value);
  }

  return (
    <div>
      <Box sx={{ height: 50, width: "100vw", backgroundColor: "red" }}>
        <Tabs
          value={selectedTab}
          onChange={(e, v) => handleTabChange(v)}
          aria-label="navigation tabs"
        >
          <Tab label="home" value="/" {...a11yProps("nav", "home")} />
          <Tab label="users" value="/users" {...a11yProps("nav", "users")} />
          <Tab label="kanban" value="/kanban" {...a11yProps("nav", "kanban")} />
        </Tabs>
      </Box>
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route path="/kanban">
          <KanbanBoard />
        </Route>
        <Route path="/users">
          <p>test</p>
        </Route>
        <Route path="*">
          <h1>Yikes! No page found here...</h1>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
