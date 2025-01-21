import './App.css';
import MovieInfo from './MovieInfo/MovieInfo';
import MovieCard from './MovieCard/MovieCard';
import MI1 from './MovieCard/MI1.jpg';
import {BrowserRouter, Routes, Route, useParams} from 'react-router-dom';

function MovieInfoWrapper() {
  const { id } = useParams();
  return <MovieInfo id={id} />;
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/api/movies/:id" element={<MovieInfoWrapper />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
