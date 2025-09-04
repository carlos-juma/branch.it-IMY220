import React from 'react'
import backgroundImage from "../../public/assets/images/background.svg";

export default function SplashPage() {
return (
    <div style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        minHeight: '100vh',
        width: '100%'
    }}>
    </div>
)
}
