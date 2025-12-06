import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
// import "./styles/global.css";
import "./index.css";
import "./styles/Navbar.css";
import "./styles/Sidebar.css";
// import "./styles/Layout.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
