import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [term, setTerm] = useState<string>("");

  const callApi = () => {
    return;
  };

  useEffect(() => {
    const delayApiCallTimer = setTimeout(() => {
      callApi();
    }, 400);

    return () => clearTimeout(delayApiCallTimer);
  }, [term]);

  return (
    <div className="bg-black">
      <main className="py-8">
        <input
          className="border-2 text-white border-gray-600 bg-black rounded-s mr-2 h-8 rounded-md px-2"
          placeholder="Search..."
          onChange={(e) => setTerm(e.target.value)}
          value={term}
        />
        <button className="rounded-md bg-gradient-to-br from-purple-800 to-pink-500 text-white font-bold h-8 px-2">
          Search
        </button>
      </main>
    </div>
  );
}

export default App;
