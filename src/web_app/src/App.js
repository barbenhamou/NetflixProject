import './App.css'
import React from 'react';
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import LoginForm from './SubscriptionForms/LoginForm';
import SignUpForm from './SubscriptionForms/SignUpForm';
import MovieInfo from './MovieInfo/MovieInfo';
import MovieWatch from './MovieWatch/MovieWatch';
import Admin from './pages/Admin';
import Home from './pages/Home';

function MovieInfoWrapper() {
  const { id } = useParams();
  return <MovieInfo id={id} />;
}

function MoviePlayWrapper() {
  const { id } = useParams();
  return <MovieWatch id={id} />;
}

function NotFound() {
  return (
    <div className="not-found">
      <h2>404 - Page Not Found</h2>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/movies/:id/info" element={<MovieInfoWrapper />} />
          <Route path="/movies/:id/watch" element={<MoviePlayWrapper />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      {/* TODO: Put the iframe in <Route path="/" /> */}
      {/* <iframe title="hidden" src="http://localhost:3000/movies/67936f2a686d1e3d89062f93/info"></iframe> */}
    </div>
  );
}

export default App;