// src/components/Footer.jsx

import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="footer p-10 bg-base-200 text-base-content mt-10 border-t border-base-300">
      <div>
        <span className="footer-title">EduAltTech</span>
        <p className="max-w-xs">
          Empowering students and educators through accessible, modern, and
          real-world tech education.
        </p>
      </div>
      <div>
        <span className="footer-title">Pages</span>
        <Link to="/" className="link link-hover">
          Home
        </Link>
        <Link to="/about" className="link link-hover">
          About
        </Link>
        <Link to="/courses" className="link link-hover">
          Courses
        </Link>
        <Link to="/contact" className="link link-hover">
          Contact
        </Link>
      </div>
      <div>
        <span className="footer-title">Follow Us</span>
        <a
          href="https://github.com/RanadeepVinukonda"
          target="_blank"
          rel="noopener noreferrer"
          className="link link-hover"
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/ranadeepvinukonda/"
          target="_blank"
          rel="noopener noreferrer"
          className="link link-hover"
        >
          LinkedIn
        </a>
      </div>
    </footer>
  );
};

export default Footer;
