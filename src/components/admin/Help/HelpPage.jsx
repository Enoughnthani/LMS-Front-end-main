import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function HelpPage() {
 
    const navigate = useNavigate()

    return (
    <div>
      
      <button  onClick={()=>navigate(-1)}>Back</button>

      <h1>Help Page</h1>

    </div>
  )
}
