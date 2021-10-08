import React, { Component } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "./home/HomePage";

export default function App() {
  return (
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
  );
}

render(<App />, document.getElementById("app"));
