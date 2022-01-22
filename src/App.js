import './App.css'
import { Routes, Route, BrowserRouter } from "react-router-dom"
import { Provider } from 'react-redux'

// Pages imports
import Login from './pages/Login'
import Control from './pages/Control'
import { store } from './store/Store'

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/control" element={<Control />} />
                </Routes>
            </BrowserRouter>
        </Provider>
    )
}

export default App
