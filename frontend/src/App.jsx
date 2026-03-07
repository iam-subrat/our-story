import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import CreateStory from './pages/CreateStory'
import StoryPage from './pages/StoryPage'
import UserTimeline from './pages/UserTimeline'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/create" element={<CreateStory />} />
        <Route path="/s/:id" element={<StoryPage />} />
        <Route path="/user/:creatorName" element={<UserTimeline />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
