import { Link } from "react-router";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      className="footer p-10 bg-base-200 text-base-content mt-10 border-t border-base-300"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div>
        <span className="footer-title text-green-700">EduAltTech</span>
        <p className="max-w-xs text-gray-600">
          Empowering students and educators through accessible, modern, and
          real-world tech education.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          © {currentYear} EduAltTech. All rights reserved.
        </p>
      </div>

      <div>
        <span className="footer-title text-green-700">Pages</span>
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
        <span className="footer-title text-green-700">Follow Us</span>
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
    </motion.footer>
  );
};

export default Footer;
