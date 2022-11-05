import "./App.css";

import { useEffect, useRef, useState } from "react";

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
  const [snoopData, setSnoopData] = useState<any>([]);
  const [vectorSize, setVectorSize] = useState<null | number>();
  const [lastSnoopTime, setLastSnoopTime] = useState<null | number>(null);
  const [loading, setLoading] = useState(false);
  const [soundPlayed, setSoundPlayed] = useState(false);
  const [moveDoge, setMoveDoge] = useState(false);

  const snoopSound = useRef<HTMLAudioElement>();

  useEffect(() => {
    snoopSound.current = new Audio(`${process.env.PUBLIC_URL}/snoop.wav`);
    snoopSound.current.volume = 0.5;
  }, []);

  const callTextSnoopApi = (t: string) => {
    setTerm(t);
    if (t !== "") {
      const timeNow = Number(new Date());
      setLoading(true);
      fetch(`${BACKEND_URL}/search_by_prompt`, {
        body: JSON.stringify({
          prompt: t,
          amount: 10,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
      })
        .then((response) => {
          setLoading(false);
          setLastSnoopTime(Number(new Date()) - timeNow);
          return response.json();
        })
        .then((data: any) => {
          // will decide what to do with this response later
          processResponse(data);
        });
    }
  };

  const callImageSnoopApi = (image: string, isUrl?: boolean) => {
    if (!soundPlayed || Math.random() > 0.6) {
      snoopSound.current?.play();
      setSoundPlayed(true);
      setMoveDoge(true);

      setTimeout(() => {
        setMoveDoge(false);
      }, 3000);
    }

    const timeNow = Number(new Date());
    setLoading(true);
    fetch(`${BACKEND_URL}/search_by_image`, {
      body: JSON.stringify(
        isUrl ? { type: "url", image } : { type: "base64", image }
      ),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
    })
      .then((response) => {
        setLoading(false);
        setLastSnoopTime(Number(new Date()) - timeNow);
        return response.json();
      })
      .then((data: any) => {
        processResponse(data);
      });
  };

  const processResponse = (data: any) => {
    // response needs to be fixed up...
    const names = data.names;
    const urls = JSON.parse(data.urls.replace(/'/g, '"'));
    const dists = JSON.parse(data.dists.replace(/'/g, '"'));

    const result = [];

    const unique_names: string[] = [];

    for (let i = 0; i < names.length; i++) {
      if (unique_names.includes(names[i])) {
        //continue;
      }
      result.push({
        name: names[i],
        src: urls[i],
        dist: dists[i],
      });
      unique_names.push(names[i]);
    }

    setVectorSize(data.db_size);
    setSnoopData(result);
  };

  useEffect(() => {
    const delayApiCallTimer = setTimeout(() => {
      callTextSnoopApi(term);
    }, 400);

    return () => clearTimeout(delayApiCallTimer);
  }, [term]);

  return (
    <div className="bg-[#10081B] text-white absolute h-full w-full overflow-x-auto">
      <main className="w-full ml-auto mr-auto px-4 md:w-[40rem]">
        <img
          className="py-8"
          src={`${process.env.PUBLIC_URL}/logo.png`}
          width="60%"
          alt="SNOOP DOGE"
        />
        <p className="mb-4">
          You probably think NFT's are bullsh*t. Probably, you can't get on
          snooping the marketplace for what you want.
        </p>
        <p className="mb-8 font-bold">
          Because all NFT marketplaces lack proper recommendation engines and
          image classification.
        </p>
        <div
          className="rounded-lg p-1 bg-no-repeat bg-cover bg-center flex flex-col md:flex-row"
          style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/bg.jpg)` }}
        >
          <label
            htmlFor="file-upload"
            className="bg-black rounded-md hover:cursor-pointer flex flex-row items-center justify-center mb-2 md:mb-0 md:w-1/2 hover:scale-95 duration-200"
          >
            <UploadIcon />
            <span className="font-bold text-md leading-tight md:text-lg">
              TAKE A PICTURE
            </span>
          </label>
          <input
            type="file"
            onChange={(e) => {
              getBase64((e.target.files as any)[0]).then((base64) =>
                callImageSnoopApi(base64)
              );
            }}
            className="hidden"
            placeholder="Test"
            id="file-upload"
          />
          <input
            className="text-white bg-black rounded-s h-12 rounded-md px-2 md:ml-2 md:w-1/2"
            placeholder="Or snoop by text..."
            onChange={(e) => setTerm(e.target.value)}
            value={term}
          />
        </div>
        <div
          className="rounded-lg bg-no-repeat bg-cover bg-center blur-md h-1 mb-3 mx-2"
          style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/bg.jpg)` }}
        />
        <div className="flex flex-row mb-4 gap-1 flex-wrap">
          <ExampleSnoopTerm
            term="Pixelated cat"
            onClick={() => setTerm("pixelated cat")}
          />
          <ExampleSnoopTerm
            term="Duck with tattoos"
            onClick={() => setTerm("duck with tattoos")}
          />
          <ExampleSnoopTerm
            term="Bored monkey"
            onClick={() => setTerm("bored monkey")}
          />
          <ExampleSnoopTerm
            term="Doge with sunglasses"
            onClick={() => setTerm("doge with sunglasses")}
          />
          <ExampleSnoopTerm
            term="Cyberpunk"
            onClick={() => setTerm("cyberpunk")}
          />
          <ExampleSnoopTerm
            term="Van Gogh"
            onClick={() => setTerm("van gogh")}
          />
          <ExampleSnoopTerm term="Hacker" onClick={() => setTerm("hacker")} />
          <ExampleSnoopTerm
            term="Matryoshka"
            onClick={() => setTerm("matryoshka")}
          />
        </div>
        {loading && (
          <div className="flex justify-end mb-4">
            <div className="flex flex-row rounded-full bg-violet-900 text-sm px-4">
              Loading...
            </div>
          </div>
        )}
        {!loading && snoopData && (
          <div className="flex justify-end mb-4">
            <div className="flex flex-row rounded-full bg-violet-900 text-sm">
              {lastSnoopTime && (
                <div className="px-2 border-r-2 border-black">
                  {lastSnoopTime} ms
                </div>
              )}
              {vectorSize && (
                <div className="px-2 border-r-2 border-black">
                  {vectorSize} images indexed
                </div>
              )}
              {term && (
                <a
                  href={`https://www.binance.com/en/nft/snoop-result?tab=nft&keyword=${encodeURIComponent(
                    term
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2"
                >
                  See results on Binance
                </a>
              )}
            </div>
          </div>
        )}
        <img
          src={`${process.env.PUBLIC_URL}/doge.png`}
          width="200"
          height="200"
          className={`fixed z-10 left-0 top-0 ${
            moveDoge ? "opacity-100" : "opacity-0 -translate-x-10"
          } duration-500 pointer-events-none`}
          alt="snooping"
        />
        <div
          className={`grid grid-cols-2 gap-4 duration-300 ${
            loading ? `opacity-50` : ``
          }`}
        >
          {snoopData.map((sd: any) => (
            <ImageResult
              imageSrc={sd.src}
              name={sd.name}
              dist={sd.dist}
              onClick={() => {
                callImageSnoopApi(sd.src, true);
              }}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export const ExampleSnoopTerm = (props: {
  term: string;
  onClick: () => any;
}) => {
  return (
    <button
      className="bg-black text-sm rounded-md p-2 py-0 border-[1px] border-violet-800 hover:scale-105 duration-150 whitespace-nowrap"
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
      className="p-[2px] rounded-sm bg-cover bg-center hover:scale-105 hover:cursor-pointer duration-200"
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
          </div>
        </div>
      </div>
    </div>
  );
};

const UploadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    className="m-2 mr-4 w-8 h-8"
  >
    <path
      fill="white"
      d="M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 384c-53 0-96-43-96-96s43-96 96-96s96 43 96 96s-43 96-96 96z"
    />{" "}
  </svg>
);

export default App;
