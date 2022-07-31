import React from "react";
import "./App.css";
import Navbar from "./components/navbar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Account from "./pages/account";
// import {Link} from 'react-router-dom'
// import Sidebar from './components/Sidebar';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Switch>
          <Route path="/" component={Account} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
