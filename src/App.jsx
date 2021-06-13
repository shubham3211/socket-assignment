import React from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Navbar from "./Components/Navbar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { paths } from "./utils/appPaths";
import { LoaderProvider } from "./context/Loader/Loader";
import { NotificationProvider } from "./context/Notification/Notification";
import { UserProvider } from "./context/User/User";

function App() {
  return (
    <Router>
      <UserProvider>
        <NotificationProvider>
          <LoaderProvider>
            <Navbar />
            <Switch>
              <Route path={paths.HOME}>
                <Home />
              </Route>
              <Route path={paths.LOGIN}>
                <Login />
              </Route>
            </Switch>
          </LoaderProvider>
        </NotificationProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
