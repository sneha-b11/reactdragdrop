import React from 'react';
import  { useNavigate } from 'react-router-dom';

const Navbar = ({ username }) => {
  const navigate = useNavigate();

  const onLogout = () => {
    navigate("/");
  }

  return (
    <nav style={{ display:'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', backgroundColor: '#333', color: '#fff', position:'fixed', width:'98%'}}>
      <div>
        Welcome, {username}
      </div>
      <div>
        <button onClick={onLogout} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
