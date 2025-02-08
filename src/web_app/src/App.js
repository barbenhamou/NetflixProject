import './App.css'
import React from 'react';
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import LoginForm from './SubscriptionForms/LoginForm';
import SignUpForm from './SubscriptionForms/SignUpForm';
import MovieInfo from './MovieInfo/MovieInfo';
import MovieWatch from './MovieWatch/MovieWatch';
import Home from './pages/Home';
import Admin from './pages/Admin';
import GuestPage from './pages/guest';
function MovieInfoWrapper() {
  const { id } = useParams();
  return <MovieInfo id={id} />;
}

function MoviePlayWrapper() {
  const { id } = useParams();
  return <MovieWatch id={id} />;
}

function HomePageWrapper() {
  if (localStorage.getItem("authToken")) {
    return <Home />;
  }
  return <GuestPage />;
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
          <Route path="/" element={<HomePageWrapper />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;