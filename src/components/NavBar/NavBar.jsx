import { NavLink, Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = (props) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">GainZ</Link>
      </div>
      <div className="navbar-links">
        {props.user ? (
          <>
            <NavLink to="/programs" className="nav-link" activeClassName="active">
              Programs
            </NavLink>
            <NavLink to="/exercises" className="nav-link" activeClassName="active">
              Exercise Library
            </NavLink>
            <button onClick={props.handleSignOut} className="nav-button">
              Sign Out
            </button>
          </>
        ) : (
          <>
            <NavLink to="/sign-up" className="nav-link" activeClassName="active">
              Sign Up
            </NavLink>
            <NavLink to="/sign-in" className="nav-link" activeClassName="active">
              Sign In
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;