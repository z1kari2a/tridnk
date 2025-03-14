import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("Main.tsx: Starting application");
const rootElement = document.getElementById("root");
console.log("Root element found:", rootElement);

try {
  createRoot(rootElement!).render(<App />);
  console.log("App rendered successfully");
} catch (error) {
  console.error("Error rendering application:", error);
}
