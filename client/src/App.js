
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import './App.css';
import Navbars from './components/navbar/Navbar';
import Home from './pages/public/home/home';
import About from './pages/public/about/About';
import Mission from './pages/public/mission/Mission';
import Docs from './pages/public/docs/Docs';
import Login from './pages/public/login/Login';
import Media from './pages/public/media/Media';



function App() {
  return (
    <Router>
      <Navbars/>
      <Routes>
      <Route path='/' element={<Home />}></Route>
      <Route path='/About' element={<About/>}></Route>
      <Route path='/Mission' element={<Mission/>}></Route>
      <Route path='/Docs' element={<Docs/>}></Route>
      <Route path='/Login' element={<Login/>}></Route>
      <Route path='/Media' element={<Media/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
