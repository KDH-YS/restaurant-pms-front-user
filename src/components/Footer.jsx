import React from 'react';
import '../css/Footer.css'; 

function Footer() {
  return (
    <footer className="footer bg-dark text-white text-center py-3">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Rechelin Korea. All rights reserved.</p>
        <div className="footer-links">
          <a className="text-white mx-3">Privacy Policy</a>
          <a className="text-white mx-3">Terms of Service</a>
          <a className="text-white mx-3">Contact Us</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;