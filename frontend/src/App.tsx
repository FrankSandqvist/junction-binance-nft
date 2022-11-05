import "./App.css";

import { useEffect, useState } from "react";

import { BACKEND_URL } from "./config";

const blobFromUrl = () => {};

function App() {
  const [term, setTerm] = useState<string>("");
  const [searchData, setSearchData] = useState<any>([]);
  const [lastSearchTime, setLastSearchTime] = useState<null | number>(null);
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);

  const callTextSearchApi = (t: string) => {
    setTerm(t);
    if (t !== "") {
      const timeNow = Number(new Date());
      fetch(`${BACKEND_URL}/search_by_prompt`, {
        body: JSON.stringify({
          prompt: t,
          amount: 10,
          indexName: showOnlyVerified ? "verified" : "unverified",
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
      })
        .then((response) => {
          setLastSearchTime(Number(new Date()) - timeNow);
          return response.json();
        })
        .then((data: any) => {
          // will decide what to do with this response later

          // response needs to be fixed up...
          const names = JSON.parse(data.names.replace(/'/g, '"'));
          const urls = JSON.parse(data.urls.replace(/'/g, '"'));
          const dists = JSON.parse(data.dists.replace(/'/g, '"'));

          const result = [];

          for (let i = 0; i < names.length; i++) {
            result.push({
              name: names[i],
              src: urls[i],
              dist: dists[i],
            });
          }

          setSearchData(result);
        });
    }
  };

  useEffect(() => {
    const delayApiCallTimer = setTimeout(() => {
      callTextSearchApi(term);
    }, 400);

    return () => clearTimeout(delayApiCallTimer);
  }, [term]);

  console.log(searchData);

  return (
    <div className="bg-[#10081B] text-white absolute h-full w-full overflow-x-auto">
      <main className="w-full ml-auto mr-auto px-4 md:w-[40rem]">
        <img
          className="py-8"
          src={`${process.env.PUBLIC_URL}/logo.png`}
          width={300}
          alt="INFINIFT"
        />
        <p className="mb-8">
          You probably think NFT's are bullsh*t. That's because you've been
          recommended any nice NFT art that you like. Because all NFT
          marketplaces lack proper recommendation engines and image
          classification
        </p>
        <div className="flex justify-end mb-2">
          <button
            className={`px-2 rounded-md border-[1px] border-violet-800 ${
              showOnlyVerified ? `bg-violet-800` : ``
            }`}
            onClick={() => setShowOnlyVerified((v) => !v)}
          >
            Show verified only
          </button>
        </div>
        <div
          className="rounded-lg p-1 bg-no-repeat bg-cover bg-center"
          style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/bg.jpg)` }}
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
          style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/bg.jpg)` }}
        />
        <div className="flex flex-row mb-4 gap-2">
          <ExampleSearchTerm term="Cat" onClick={() => setTerm("cat")} />
          <ExampleSearchTerm
            term="Duck with green hair"
            onClick={() => setTerm("duck with green hair")}
          />
          <ExampleSearchTerm
            term="Sports car"
            onClick={() => setTerm("sports car")}
          />
        </div>
        {searchData && (
          <div>
            <a
              href={`https://www.binance.com/en/nft/search-result?tab=nft&keyword=${encodeURIComponent(
                term
              )}`}
            >
              Check on Binance
            </a>
          </div>
        )}
        {lastSearchTime && <div>{lastSearchTime} ms</div>}
        <div className="grid grid-cols-2 gap-4">
          {searchData.map((sd: any) => (
            <ImageResult imageSrc={sd.src} name={sd.name} dist={sd.dist} />
          ))}
        </div>
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

export const ImageResult = (props: {
  imageSrc: string;
  name: string;
  dist: number;
}) => {
  return (
    <div
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/bg.jpg)` }}
      className="p-[2px] rounded-sm bg-cover bg-center hover:scale-105 duration-200"
    >
      <div
        className="bg-black h-64 bg-cover relative border-[1px] border-[rgba(0,0,0,0.7)]"
        style={{ backgroundImage: `url(${props.imageSrc}` }}
      >
        <div className="absolute w-full h-full from-transparent to-[rgba(0,0,0,0.5)] bg-gradient-to-b flex items-end justify-end p-2 flex-col">
          {props.name}
          <div className="text-sm text-white flex flex-row gap-1 flex-wrap items-end justify-end">
            <span className="bg-[rgba(0,0,0,0.7)] px-1 rounded-sm">
              <span className="opacity-50">dist</span> {props.dist}
            </span>
            <span className="bg-[rgba(0,0,0,0.7)] px-1 rounded-sm">
              <span className="opacity-50">vector size</span> 512bytes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
