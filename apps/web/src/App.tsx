import { useEffect, useState } from "react";
import { IncidentsPage } from "./IncidentsPage";

interface HealthResponse {
  status: string;
  message: string;
  time: string;
}
function App() {
  const [, setHealth] = useState<HealthResponse | { error: string }>();

  useEffect(() => {
fetch("/api/health")
    .then(async (r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}: ${await r.text()}`);
      return r.json();
    })
    .then(setHealth)
    .catch((e) => setHealth({ error: String(e) }));
  }, []);

  return (
    <IncidentsPage />
  );
}

export default App;