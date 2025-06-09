import PlantsList from './pages/PlantsList'
import Plant from './pages/Plant'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PlantsList />} />
        <Route path="/:id" element={<Plant />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App
