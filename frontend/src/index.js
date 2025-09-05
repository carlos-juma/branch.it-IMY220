import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import SplashPage from './pages/SplashPage';
import Header from './components/header';
import HomePage from './pages/HomePage';


function App (){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SplashPage />} />
            </Routes>
            <Routes>
                <Header />
                <Route path="/home" element={<HomePage />} />
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);