import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './SubscriptionForms/LoginForm/LoginForm'; // Assuming LoginForm is in the LoginForm folder
import SignUpForm from './SubscriptionForms/SignUpForm/SignUpForm';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
