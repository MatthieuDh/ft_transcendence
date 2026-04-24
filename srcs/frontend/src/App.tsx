import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [data, setData] = useState('')

  useEffect(() => {
    axios.get(import.meta.env.VITE_API_URL)
      .then(res => setData(res.data))
      .catch(err => setData("Error: " + err.message))
  }, [])

  return (
    <div>
      <h1>Transcendence Frontend</h1>
      <p>Bericht van de backend: <strong>{data}</strong></p>
    </div>
  )
}

export default App