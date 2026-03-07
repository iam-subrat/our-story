import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import CreateStory from './pages/CreateStory'
import StoryPage from './pages/StoryPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/create" element={<CreateStory />} />
        <Route path="/s/:id" element={<StoryPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
