import React from "react";
import { NavLink } from "react-router-dom";
import "./AppSidebar.scss";

const AppSidebar = () => {
  return (
    <aside className="app-sidebar">
      <nav>
        <ul>
          <li>
            <NavLink to="/" end>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/phong-ban">Phòng ban</NavLink>
          </li>
          <li>
            <NavLink to="/nhan-vien">Nhân viên</NavLink>
          </li>
          <li>
            <NavLink to="/cham-cong">Chấm công</NavLink>
          </li>
          <li>
            <NavLink to="/luong">Tính lương</NavLink>
          </li>
          <li>
            <NavLink to="/bao-cao">Báo cáo</NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AppSidebar;
