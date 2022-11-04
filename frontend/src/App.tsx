import "./App.css";

import { useEffect, useState } from "react";

import { BACKEND_URL } from "./config";

function App() {
  const [term, setTerm] = useState<string>("");
  const [searchData, setSearchData] = useState<any>([]);

  const callTextSearchApi = (t: string) => {
    fetch(`${BACKEND_URL}/search_by_prompt`, {
      body: JSON.stringify({ prompt: t }),
      method: "POST",
    })
      .then((response) => response.json())
      .then((data: any) => {
        // will decide what to do with this response later
        console.log(data);
        setSearchData(data);
      });
  };

  useEffect(() => {
    const delayApiCallTimer = setTimeout(() => {
      callTextSearchApi(term);
    }, 400);

    return () => clearTimeout(delayApiCallTimer);
  }, [term]);

  return (
    <div className="bg-[#10081B] text-white absolute h-full w-full">
      <main className="w-full ml-auto mr-auto px-4 md:w-[40rem]">
        <img className="py-8" src="/logo.png" width={300} alt="INFINIFT" />
        <p className="mb-8">
          You probably think NFT's are bullsh*t. That's because you've been
          recommended any nice NFT art that you like. Because all NFT
          marketplaces lack proper recommendation engines and image
          classification
        </p>
        <div
          className="rounded-lg p-1 bg-no-repeat bg-cover bg-center"
          style={{ backgroundImage: 'url("/bg.jpg")' }}
        >
          <input
            className="w-full text-white bg-black rounded-s mr-2 h-12 rounded-md px-2"
            placeholder="Start typing..."
            onChange={(e) => setTerm(e.target.value)}
            value={term}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
