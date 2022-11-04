import "./App.css";

function App() {
  return (
    <div className="bg-black">
      <main className="py-8">
        <input
          className="border-2 border-gray-600  bg-black rounded-s mr-2 h-8 rounded-md px-2"
          placeholder="Search..."
         />
        <button className="rounded-md bg-gradient-to-br from-purple-800 to-pink-500 text-white font-bold h-8 px-2">
          Search
        </button>
      </main>
    </div>
  );
}

export default App;
