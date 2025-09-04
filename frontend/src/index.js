import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import SplashPage from './pages/SplashPage';

function App (){
    return (
        <div className='text-blue-500'>
            <SplashPage />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);