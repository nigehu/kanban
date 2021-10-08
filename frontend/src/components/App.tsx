import { Box, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "./home/HomePage";

function App() {
  const [selectedTab, setSelectedTab] = useState("home");

  function a11yProps(tabGroup: string, id: string) {
    return {
      id: `${tabGroup}-tab-${id}`,
      "aria-controls": `${tabGroup}-tabpanel-${id}`,
    };
  }

  function handleTabChange() {}

  return (
    <div>
      <Box sx={{ height: 50, width: "100vw", backgroundColor: "red" }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="navigation tabs"
        >
          <Tab label="home" value="home" {...a11yProps("nav", "home")} />
          <Tab label="users" value="users" {...a11yProps("nav", "users")} />
        </Tabs>
      </Box>
      <Router>
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route path="/kanban">
            <h1>React Kanban Board!</h1>
          </Route>
          <Route path="/users/:id">
            <p>test</p>
          </Route>
          <Route path="*">
            <h1>Yikes! No page found here...</h1>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
