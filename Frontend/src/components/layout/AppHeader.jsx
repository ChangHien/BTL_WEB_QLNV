import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import "./AppHeader.scss";

const AppHeader = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => logout();
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="logo">
          <Link to="/">Company Logo</Link>
        </h1>
      </div>

      <div className="header-right">
        <div className="user-info" onClick={toggleDropdown}>
          <span className="user-name">Xin chào, {user?.fullName}</span>
          <img
            className="user-avatar"
            src={user?.avatar || "/images/default-avatar.png"}
            alt="Avatar"
          />
        </div>

        {dropdownOpen && (
          <div className="dropdown-menu">
            <Link to="/profile" className="dropdown-item">
              Hồ sơ
            </Link>
            <button onClick={handleLogout} className="dropdown-item logout-btn">
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
