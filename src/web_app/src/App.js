import './App.css';
import MovieInfo from './MovieInfo/MovieInfo';
import MovieWatch from './MovieWatch/MovieWatch';
import UserPage from './pages/Home';
import {BrowserRouter, Routes, Route, useParams} from 'react-router-dom';

function MovieInfoWrapper() {
  const { id } = useParams();
  return <MovieInfo id={id} />;
}

function MoviePlayWrapper() {
  const { id } = useParams();
  return <MovieWatch id={id} />;
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/api/movies/:id/info" element={<MovieInfoWrapper />} />
          <Route path="/api/movies/:id/watch" element={<MoviePlayWrapper />} />
          <Route path="/" element={<UserPage/>} />
        </Routes>
      </BrowserRouter>
      {/* TODO: Put the iframe in <Route path="/" /> */}
      {/* <iframe title="hidden" src="http://localhost:3000/api/movies/67936f2a686d1e3d89062f93/info"></iframe> */}
    </div>
  );
}

export default App;
