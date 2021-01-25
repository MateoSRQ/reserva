import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import Intro from "./elements/intro/element";
import Formulario from "./elements/form/registro";
import Formulario2 from "./elements/form2/registro";
import Reclamo from "./elements/reclamo";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Intro />
        </Route>
        <Route exact path="/formulario">
          <Formulario />
        </Route>
        <Route exact path="/ficha">
          <Formulario2 />
        </Route>
        <Route exact path="/reclamo">
          <Reclamo />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
