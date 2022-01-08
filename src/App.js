import './App.css';
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  BrowserRouter,
} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<PublicPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


function Layout() {
  return (
    <div>

      <ul>
        <li>
          <Link to="/">Public Page</Link>
        </li>
        <li>
          <Link to="/login">Protected Page</Link>
        </li>
      </ul>

    </div>
  );
}

function LoginPage() {
  return (
    <div>
      <p>You must log in to view the page at </p>

      <form>
        <label>
          Username: <input name="username" type="text" />
        </label>{" "}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}


function PublicPage() {
  return <h3>Public</h3>;
}


export default App;
