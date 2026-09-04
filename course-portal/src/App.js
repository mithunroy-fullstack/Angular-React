import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import CourseList from './components/CourseList';
import CourseForm from './components/CourseForm';
import Header from './components/Header';

function TokenHandoff() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');
    if (!token) {
      return;
    }

    localStorage.setItem('token', token);
    navigate(location.pathname, { replace: true });
  }, [location.pathname, location.search, navigate]);

  return null;
}

function App() {
  return (
    <Router>
      <TokenHandoff />
      <Header />
      <div className="container mt-4">
        <Routes>
          <Route path="/course/dashboard" element={<CourseList />} />
          <Route path="/course/add" element={<CourseForm />} />
          <Route path="/course/edit/:id" element={<CourseForm />} />          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
