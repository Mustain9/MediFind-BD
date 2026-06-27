import { useEffect, useState } from "react";
import api from "../services/api";

function App() {

  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/test")
      .then((res) => {
        setMessage(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div style={{padding:40}}>
      <h1>MediFind BD</h1>

      <h2>{message}</h2>

    </div>
  );
}

export default App;