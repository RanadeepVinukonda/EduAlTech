import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
      <h1 className="text-5xl font-bold text-error">404</h1>
      <p className="text-xl mt-4">Page Not Found</p>
      <Link to="/" className="btn btn-primary mt-6">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
