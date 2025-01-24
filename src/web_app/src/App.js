import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './SubscriptionForms/LoginForm/LoginForm'; // Assuming LoginForm is in the LoginForm folder
import SignUpForm from './SubscriptionForms/SignUpForm/SignUpForm';
import MovieInfo from './MovieInfo/MovieInfo';
import MovieWatch from './MovieWatch/MovieWatch';

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
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
        </Routes>
      </BrowserRouter>
      {/* TODO: Put the iframe in <Route path="/" /> */}
      {/* <iframe title="hidden" src="http://localhost:3000/api/movies/679128f92a7b20941e6ca005/info"></iframe> */}
    </div>
  );
}

export default App;