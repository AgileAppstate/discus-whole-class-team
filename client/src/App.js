import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Navbars from './components/navbar/Navbar';
import Home from './pages/public/home/home';
import About from './pages/public/about/About';
import Login from './pages/public/login/Login';
import Media from './pages/public/media/Media';
import Playlists from './pages/public/playlists/Playlists';
import LiveFeed from './pages/public/livefeed/LiveFeed';

function App() {
  return (
    <Router>
      <Navbars />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/About" element={<About />}></Route>
        <Route path="/Login" element={<Login />}></Route>
        <Route path="/Media" element={<Media />}></Route>
        <Route path="/Playlists" element={<Playlists />}></Route>
        <Route path="/LiveFeed" element={<LiveFeed />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
