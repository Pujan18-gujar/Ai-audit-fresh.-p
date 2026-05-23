import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SpendForm from './SpendForm'
import Results from './Results'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SpendForm />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App