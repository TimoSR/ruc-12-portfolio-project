import { useState, type JSX } from "react";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
import "../App.css";

export function Root(): JSX.Element {
  const [count, setCount] = useState<number>(0);

  return (
    <>
      <div className="flex items-center gap-6">
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <img
            src={viteLogo}
            className="logo w-40 h-40"
            alt="Vite logo"
          />
        </a>

        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img
            src={reactLogo}
            className="logo react w-50 h-40"
            alt="React logo"
          />
        </a>
      </div>

      <h1>Vite + React</h1>

      <h1 className="text-3xl font-bold underline text-amber-500">
        Hello world!
      </h1>

      <div className="card mt-6">
        <button
          onClick={() => {
            return setCount((prev) => prev + 1);
          }}
          className="border px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          count is {count}
        </button>

        <p className="mt-3">
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>

      <p className="read-the-docs mt-4">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}