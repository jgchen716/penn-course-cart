import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.tsx";
import * as serviceWorker from "./serviceWorker.js";

ReactDOM.render(<App />, document.getElementById("root"));

serviceWorker.unregister();
