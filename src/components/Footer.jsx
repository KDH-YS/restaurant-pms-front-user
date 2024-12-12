import React from 'react';
import '../css/Footer.css';
// import {Link} from "react-router-dom";

export function Footer() {
  return (
    <footer className="footer bg-dark text-white text-center py-3">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Rechelin Korea. All rights reserved.</p>
        <div className="footer-links">
          <span className="text-white mx-3" >Privacy Policy</span>
          <span className="text-white mx-3" >Terms of Service</span>
          <span className="text-white mx-3" >Contact Us</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;