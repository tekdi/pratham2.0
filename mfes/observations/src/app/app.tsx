// Uncomment this line to use CSS modules
// import styles from './app.module.css';

import { Route, Routes, Link } from 'react-router-dom';
import Observations from '../components/Observations';
import { ToastContainer } from 'react-toastify';

export function App() {
  return (
    <div>
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      />
      <Routes>
        <Route path="/" element={<Observations />} />
        {/* <Route
            path="/page-2"
            element={
              <div>
                <Link to="/">Click here to go back to root page.</Link>
              </div>
            }
          /> */}
      </Routes>
      {/* END: routes */}
    </div>
  );
}

export default App;
