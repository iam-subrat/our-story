import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ClaimAccount from "./pages/ClaimAccount";
import CreateStory from "./pages/CreateStory";
import StoryPage from "./pages/StoryPage";
import UserTimeline from "./pages/UserTimeline";

function App() {
  const isGithubPages = window.location.hostname.endsWith("github.io");
  const basename = isGithubPages ? import.meta.env.BASE_URL : "/";
  return (
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/claim" element={<ClaimAccount />} />
            <Route path="/create" element={<CreateStory />} />
            <Route path="/s/:id" element={<StoryPage />} />
            <Route path="/user/:username" element={<UserTimeline />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
