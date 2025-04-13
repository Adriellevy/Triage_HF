window.global = window;
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import WebRTCChat from "./WebRTCChat";

function App() {
  const [count, setCount] = useState(0);

  const connectToServer = () => {
    console.log("Connecting to the server...");
    // Add your server connection logic here
  };

  return (
    <>
      <WebRTCChat></WebRTCChat>
    </>
  );
}

export default App;
