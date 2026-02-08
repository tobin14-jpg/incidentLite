import { useEffect, useState } from "react";

interface HealthResponse {
  status: string;
  message: string;
  time: string;
}
function App() {
  const [health, setHealth] = useState<HealthResponse | { error: string }>();

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
    <div>
      <h1>IncidentLite</h1>
      <pre>{JSON.stringify(health, null, 2)}</pre>
    </div>
  );
}

export default App;