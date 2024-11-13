import React from 'react';
import '../css/Footer.css';
import {Link} from "react-router-dom";

function Footer() {
  return (
    <footer className="footer bg-dark text-white text-center py-3">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Rechelin Korea. All rights reserved.</p>
        <div className="footer-links">
          <Link className="text-white mx-3" to="privacyPolicy">Privacy Policy</Link>
          <Link className="text-white mx-3" to="termsOfService">Terms of Service</Link>
          <Link className="text-white mx-3" to="contactUs">Contact Us</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;