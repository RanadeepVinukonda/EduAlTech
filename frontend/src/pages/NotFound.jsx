import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 px-4 text-center">
      <h1 className="text-6xl sm:text-7xl font-extrabold text-error">404</h1>
      <p className="text-lg sm:text-xl mt-4 text-gray-700 dark:text-gray-300">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="mt-6 btn btn-primary hover:scale-105 transition-transform duration-200"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
