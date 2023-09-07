import React, { useState } from 'react';

  const AppNavbar = ({onNavClick})=> {
    const handleNavLinkClick = (section) => {
      onNavClick(section);
    };
    return (
      <header className = "header">
       <nav className="nav">
        <div className="logo">MyHealthSpace</div>
          <ul className="nav-bar">
          <li>
          <a href="#login" onClick={() => handleNavLinkClick('login')}>LoginForm</a>
        </li>
        <li>
          <a href="#signup" onClick={() => handleNavLinkClick('signup')}>SignupForm</a>
        </li>
          </ul>
       </nav>
      </header>
);
};


export default AppNavbar;
