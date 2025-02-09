import './App.css'
import React from 'react';
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import LoginForm from './Pages/SubscriptionForms/LoginForm';
import SignUpForm from './Pages/SubscriptionForms/SignUpForm';
import MovieInfo from './Pages/MovieInfo/MovieInfo';
import MovieWatch from './Pages/MovieWatch/MovieWatch';
import Home from './Pages/Home/Home';
import Admin from './Pages/Admin/Admin';
import GuestPage from './Guest/Guest';
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

function AdminWrapper() {
  localStorage.setItem("isAdmin", "true"); // TODO
  if (localStorage.getItem("isAdmin") === "true") {
    return <Admin />;
  }
  return <NotFound />;
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
          <Route path="/admin" element={<AdminWrapper />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;