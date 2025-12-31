import { Route, Routes } from 'react-router-dom'
import './App.css'
import Leading from './components/Leading'
import Room from './components/Room'

function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Leading />} />
        <Route path='/room' element={<Room />} />
      </Routes>
    </div>
  )
}

export default App
