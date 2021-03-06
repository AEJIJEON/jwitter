import React from "react";
import { Link } from "react-router-dom";
import "components/navigation.css";
const Navigation = ({ userObj }) => (
  <nav>
    <div className="menuContainer">
      <div className="homeContainer">
        <Link to="/" replace>
          Home
        </Link>
      </div>
      <div className="profileContainer">
        <Link to="/profile" replace>
          {userObj.displayName}의 Profile
        </Link>
      </div>
    </div>
  </nav>
);
export default Navigation;
