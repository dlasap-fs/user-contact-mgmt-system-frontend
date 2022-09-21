import logo from './logo.svg';
import { CMSForm } from './components/CMSForm'
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div> <h1> Contact Management System </h1>
        <p> ReactJS</p></div>
      </header>
      <CMSForm/>
    </div>
  );
}

export default App;
