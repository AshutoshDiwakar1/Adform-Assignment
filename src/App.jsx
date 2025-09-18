import { useState } from 'react'
import CampaignList from './features/campaignList/CampaignList'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <CampaignList />
    </>
  )
}

export default App
