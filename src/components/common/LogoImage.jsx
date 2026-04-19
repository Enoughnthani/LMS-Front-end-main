import React from 'react'
import logoImage from "@/resources/logo.png"

export default function LogoImage() {


    return (
        <div>
            <img src={logoImage} className='object-contain' />
        </div>
    )
}
