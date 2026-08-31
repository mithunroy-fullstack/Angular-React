import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CourseList from './components/CourseList';
import CourseForm from './components/CourseForm';
import Header from './components/Header';

function App() {
  return (
    <Router>
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
