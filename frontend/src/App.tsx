import "./App.css";

import { useEffect, useState } from "react";

import { BACKEND_URL } from "./config";

const blobFromUrl = async (url: string) => {
  return fetch(url).then((res) => res.blob()); // Gets the response and returns it as a blob
};

const getBase64 = (file: File) =>
  new Promise<string>((res, rej) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      res(reader.result as string);
    };
    reader.onerror = function (error) {
      rej(error);
    };
  });

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
          processResponse(data);
        });
    }
  };

  const callImageSearchApi = (base64: string) => {
    const timeNow = Number(new Date());

    fetch(`${BACKEND_URL}/search_by_image`, {
      body: base64,
      method: "POST",
    })
      .then((response) => {
        setLastSearchTime(Number(new Date()) - timeNow);
        return response.json();
      })
      .then((data: any) => {
        processResponse(data);
      });
  };

  const processResponse = (data: any) => {
    // response needs to be fixed up...
    const names = JSON.parse(data.names.replace(/'/g, '"'));
    const urls = JSON.parse(data.urls.replace(/'/g, '"'));
    const dists = JSON.parse(data.dists.replace(/'/g, '"'));

    const result = [];

    const unique_names: string[] = [];

    for (let i = 0; i < names.length; i++) {
      if (unique_names.includes(names[i])) {
        break;
      }
      result.push({
        name: names[i],
        src: urls[i],
        dist: dists[i],
      });
      unique_names.push(names[i]);
    }

    setSearchData(result);
  };

  useEffect(() => {
    const delayApiCallTimer = setTimeout(() => {
      callTextSearchApi(term);
    }, 400);

    return () => clearTimeout(delayApiCallTimer);
  }, [term]);

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
          You probably think NFT's are bullsh*t. Probably, you can't get on
          searching the marketplace for what you want. Because all NFT
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
          className="rounded-lg p-1 bg-no-repeat bg-cover bg-center flex flex-row"
          style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/bg.jpg)` }}
        >
          <input
            className="w-full text-white bg-black rounded-s mr-2 h-12 rounded-md px-2"
            placeholder="Start typing..."
            onChange={(e) => setTerm(e.target.value)}
            value={term}
          />
          <label htmlFor="file-upload" className="w-12 bg-black rounded-md">
            <UploadIcon />
          </label>
          <input
            type="file"
            onChange={(e) => {
              getBase64((e.target.files as any)[0]).then((base64) =>
                callImageSearchApi(base64)
              );
            }}
            className="hidden"
            placeholder="Test"
            id="file-upload"
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
            <ImageResult
              imageSrc={sd.src}
              name={sd.name}
              dist={sd.dist}
              onClick={() => {
                blobFromUrl(sd.src).then((blob) =>
                  getBase64(blob as any).then((base64) =>
                    callImageSearchApi(base64)
                  )
                );
              }}
            />
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
  onClick: () => any;
}) => {
  return (
    <div
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/bg.jpg)` }}
      className="p-[2px] rounded-sm bg-cover bg-center hover:scale-105 duration-200"
      onClick={props.onClick}
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

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path
      fill="white"
      d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456c13.3 0 24-10.7 24-24s-10.7-24-24-24s-24 10.7-24 24s10.7 24 24 24z"
    />
  </svg>
);

export default App;
