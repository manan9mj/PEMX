import './App.css';
import { Header } from './components/header';
import { Dashboard } from './components/dashboard';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Header />
        <Dashboard/>
      </header>
    </div>
  );
}

export default App;
