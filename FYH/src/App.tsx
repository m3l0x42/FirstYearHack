import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import { enable, isEnabled, disable } from '@tauri-apps/plugin-autostart';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow'; // <-- Correct v2 import

import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState(""); 

  useEffect(() => {
    const setupAutostart = async () => {
      try {
        const enabled = await isEnabled();
        if (!enabled) {
          await enable();
          console.log('Autostart has been enabled.');
        } else {
          console.log('Autostart is already enabled.');
        }
      } catch (error) {
        console.error("Failed to setup autostart:", error);
      }
    };
    setupAutostart();
  }, []);

  async function greet() {
    setGreetMsg(await invoke("greet", { name }));
  }

  // 2. Add a function to show the popup
  async function showPopup() {
    // Get a handle to the window defined in tauri.conf.json
    const popup = await WebviewWindow.getByLabel('popup');

    if (popup) {
      // Show the window, center it, and bring it to focus
      await popup.show();
      await popup.center();
      await popup.setFocus();
    }
  }

  return (
    <main className="container">
      <h1>Welcome to Tauri + React</h1>

      <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
      <p>{greetMsg}</p>

      {/* 3. Add a button to trigger the popup */}
      <div className="row">
        <button onClick={showPopup}>Show Popup</button>
      </div>
    </main>
  );
}

export default App;