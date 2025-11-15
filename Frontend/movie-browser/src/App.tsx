import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex items-center">
        <a href="https://vite.dev" target="_blank">
          <img
            src={viteLogo}
            className="logo w-40 h-40"
            alt="Vite logo"
          />
        </a>

        <a href="https://react.dev" target="_blank">
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
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
