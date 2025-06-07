import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Quote from './pages/Quote';
import Setup from './pages/Setup';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="header">
          <img src="/favicon.ico" alt="Logo" className="logo" />
          <nav>
            <Link to="/" className="nav-link">Quote</Link>
            <Link to="/setup" className="nav-link">Setup</Link>
          </nav>
        </header>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Quote />} />
            <Route path="/setup" element={<Setup />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
