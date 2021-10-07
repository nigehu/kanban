import React, { Component } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Users from "./Users";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <h1>React Homepage!</h1>
        </Route>
        <Route path="/kanban">
          <h1>React Kanban Board!</h1>
        </Route>
        <Route path="/users/:id">
          <Users />
        </Route>
        <Route path="*">
          <h1>Yikes! No page found here...</h1>
        </Route>
      </Switch>
    </Router>
  );
}

const appDiv = document.getElementById("app");

render(<App />, appDiv);
