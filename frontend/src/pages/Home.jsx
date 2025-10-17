// Home.jsx
import React from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthProvider";
import learnerPic from "../assets/learnerpic.png";
import coursesPic from "../assets/coursespic.png";
import educatorPic from "../assets/educatorpic.png";
import welcomeImg from "../assets/welcome.jpg";

// Value Proposition Logos
import affordableIcon from "../assets/affordable.png";
import mentorshipIcon from "../assets/mentorship.png";
import practicalIcon from "../assets/practical.png";
import communityIcon from "../assets/community.png";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const renderCTAButton = () => {
    if (!user) {
      return (
        <Link to="/signup">
          <button className="btn btn-success btn-wide">Get Started</button>
        </Link>
      );
    }

    switch (user.role) {
      case "seeker":
        return (
          <Link to="/courses">
            <button className="btn btn-success btn-wide">
              Explore Courses
            </button>
          </Link>
        );
      case "provider":
        return (
          <Link to="/my-lectures">
            <button className="btn btn-success btn-wide">Upload Lecture</button>
          </Link>
        );
      case "admin":
        return (
          <Link to="/admin">
            <button className="btn btn-success btn-wide">
              Admin Dashboard
            </button>
          </Link>
        );
      default:
        return null;
    }
  };

  return (
    <section className="min-h-screen bg-white text-gray-800 px-4 py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* LEFT SIDE */}
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-green-600 leading-tight">
            <span>Learn</span>
            <br />
            <span>Grow</span>
            <br />
            <span>Succeed</span>
          </h1>
          <p className="text-gray-600 text-lg">
            The alternative education platform where learners gain real
            mentorship, providers showcase their skills, and everyone grows
            together.
          </p>
          {renderCTAButton()}
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="flex justify-center">
          <img
            src={welcomeImg}
            alt="Welcome banner"
            className="rounded-lg w-full max-w-sm "
            loading="lazy"
          />
        </div>
      </div>

      {/* HIGHLIGHTS */}
      <div className="max-w-6xl mx-auto mt-16">
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <HighlightCard
            icon={learnerPic}
            title="100+"
            subtitle="Learners"
            text="Who joined and are finding ways to chase their dreams."
          />
          <HighlightCard
            icon={coursesPic}
            title="Versatile"
            subtitle="Courses"
            text="Variety of courses for every section of learners."
          />
          <HighlightCard
            icon={educatorPic}
            title="Skilled"
            subtitle="Educators"
            text="Crafting their identity by showcasing their skills."
          />
        </ul>
      </div>

      {/* FINAL CTA */}
      <div className="text-center mt-16">
        {!user ? (
          <Link to="/signup">
            <button className="btn btn-success btn-wide">
              Start Your Journey Today
            </button>
          </Link>
        ) : user.role === "provider" ? (
          <Link to="/my-lectures">
            <button className="btn btn-success btn-wide">
              Share Your Knowledge Today
            </button>
          </Link>
        ) : (
          renderCTAButton()
        )}
      </div>
    </section>
  );
};

const HighlightCard = ({ icon, title, subtitle, text }) => (
  <li className="flex gap-4 items-start bg-green-50 p-4 rounded shadow hover:shadow-md transition">
    <img
      src={icon}
      alt={subtitle}
      className="w-12 h-12 object-contain"
      loading="lazy"
    />
    <div>
      <h5 className="text-xl font-bold text-green-600">{title}</h5>
      <h6 className="text-green-500 font-medium">{subtitle}</h6>
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  </li>
);

const ValuePropCard = ({ icon, title, text }) => (
  <li className="flex gap-4 items-start bg-green-50 p-4 rounded shadow hover:shadow-md transition">
    <img
      src={icon}
      alt={title}
      className="w-20 h-20 object-contain" // ⬅️ increased from w-12 h-12
      loading="lazy"
    />
    <div>
      <h5 className="text-lg font-bold text-green-600">{title}</h5>
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  </li>
);



export default Home;
