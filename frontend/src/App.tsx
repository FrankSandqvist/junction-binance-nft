import "./App.css";

import { useEffect, useState } from "react";

import { BACKEND_URL } from "./config";

function App() {
  const [term, setTerm] = useState<string>("");
  const [searchData, setSearchData] = useState<any>([]);

  const callTextSearchApi = (t: string) => {
    setTerm(t);
    if (t !== "") {
      fetch(`${BACKEND_URL}/search_by_prompt`, {
        body: JSON.stringify({ prompt: t }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
      })
        .then((response) => response.json())
        .then((data: any) => {
          // will decide what to do with this response later
          console.log(data);
          setSearchData(data);
        });
    }
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
        <div
          className="rounded-lg bg-no-repeat bg-cover bg-center blur-sm h-1 mb-3 mx-2"
          style={{ backgroundImage: 'url("/bg.jpg")' }}
        />
        <div className="flex flex-row mb-4 gap-2">
          <ExampleSearchTerm
            term="Cat"
            onClick={() => callTextSearchApi("cat")}
          />
          <ExampleSearchTerm
            term="Duck with green hair"
            onClick={() => callTextSearchApi("duck with green hair")}
          />
          <ExampleSearchTerm
            term="Sports car"
            onClick={() => callTextSearchApi("sports car")}
          />
        </div>
        <div>{JSON.stringify(searchData)}</div>
      </main>
    </div>
  );
}

export const ExampleSearchTerm = (props: {
  term: string;
  onClick: () => any;
}) => {
  return (
    <button
      className="bg-black rounded-md p-2 py-0 border-[1px] border-violet-800 hover:scale-105 duration-150"
      onClick={props.onClick}
    >
      {props.term}
    </button>
  );
};

export default App;
