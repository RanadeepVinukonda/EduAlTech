import React from "react";
import { FaLinkedin } from "react-icons/fa";

// Sample team data — update as needed
const teamMembers = [
  {
    name: "Ranadeep Vinukonda",
    role: "Full Stack Developer",
    email: "viranadeep@gmail.com",
    phone: "+91 8919473722",
    image: "/team/ranadeep.jpg",
    linkedin: "https://www.linkedin.com/in/ranadeepvinukonda",
  },
  {
    name: "Satyanarayana Akula",
    role: "",
    email: "",
    phone: "+91 ",
    image: "/team/ananya.jpg",
    linkedin: "",
  },
  {
    name: "Al Rihab Chandhini",
    role: "",
    email: "",
    phone: "+91 ",
    image: "/team/ravi.jpg",
    linkedin: "",
  },
  {
    name: "Uma Krishna Kanth Chokkapu",
    role: "",
    email: "",
    phone: "+91 ",
    image: "/team/ravi.jpg",
    linkedin: "",
  },
];

const Contact = () => {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">Contact Us</h1>
        <p className="text-gray-600 text-lg mb-10">
          Meet the team behind EduAltTech. Reach out to us directly!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="bg-green-50 shadow-md rounded-lg p-6 hover:shadow-lg transition"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-md"
              />
              <h3 className="text-xl font-semibold text-green-700 mt-4">
                {member.name}
              </h3>
              <p className="text-green-500 font-medium">{member.role}</p>
              <div className="mt-4 text-gray-600 text-sm">
                <p>Email: {member.email}</p>
                <p>Phone: {member.phone}</p>
              </div>

              {/* LinkedIn */}
              <div className="mt-4">
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:underline text-sm"
                >
                  <FaLinkedin size={18} /> LinkedIn Profile
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;
