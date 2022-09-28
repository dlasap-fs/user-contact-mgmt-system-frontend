import { CMSForm } from './components/CMSForm'
import './App.css';
import { PostForm } from './components/PostForm';
import {
  Routes, Route, Link, BrowserRouter as Router
} from "react-router-dom";

function App() {
  return (
    <Router>
    <div className="App">
      <header className="App-header">
        <div> <h1> Contact Management System </h1>
      </div>
      </header>
      <Routes>
        <Route path="/" element={<CMSForm />} /> 
        <Route path="/submitted" element={<PostForm />} /> 

          <Route path="*" element={<h1 style={{fontSize: "30px"}}>
            ERROR 404: PAGE NOT FOUND!
            <br/>
            <p>
            <Link to="/" style={{ padding: 5 }}>
              HOME
          </Link>
            </p>
          </h1>} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;
