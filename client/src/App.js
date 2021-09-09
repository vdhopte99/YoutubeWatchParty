import Room from './pages/room/Room';
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import { BrowserRouter as Router, Switch, Route, Redirect, } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Main from './pages/main/Main'
import Join from './pages/join/Join'

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {user ? <Redirect to="/main"/> : <Register/>}
        </Route>

        <Route path="/login">
          {user ? <Redirect to="/"/> : <Login/>}
        </Route>

        <Route path="/register">
          {user ? <Redirect to="/login"/> : <Register/>}
        </Route>

        <Route path="/join">
          <Join/>
        </Route>

        <Route path="/room/:roomCode">
          <Room/>
        </Route>

        <Route path="/main">
          <Main/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
