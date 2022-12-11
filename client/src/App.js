import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Navbars from './components/navbar/Navbar';
import Home from './pages/public/home/home';
import About from './pages/public/about/About';
import Login from './pages/public/login/Login';
import Media from './pages/public/media/Media.js';
import Playlists from './pages/public/playlists/Playlists';
import Channels from './pages/public/channels/Channels';
import LiveFeed from './pages/public/livefeed/LiveFeed';
//import * as colors from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#000000'
    },
    secondary: {
      main: '#f50057'
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbars />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/About" element={<About />}></Route>
          <Route path="/Login" element={<Login />}></Route>
          <Route path="/Media" element={<Media />}></Route>
          <Route path="/Playlists" element={<Playlists />}></Route>
          <Route path="/Channels" element={<Channels />}></Route>
          <Route path="/LiveFeed" element={<LiveFeed />}></Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
