import './App.css'
import { Routes, Route, BrowserRouter } from "react-router-dom"

// Pages imports
import Login from './pages/Login'
import Control from './pages/Control'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/control" element={<Control />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
