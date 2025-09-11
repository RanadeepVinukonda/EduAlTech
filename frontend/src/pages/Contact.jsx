import React from "react";
import { FaLinkedin } from "react-icons/fa";

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
    role: "Developer",
    email: "satya@example.com",
    phone: "+91 9876543210",
    image: "/team/ananya.jpg",
    linkedin: "",
  },
  {
    name: "Al Rihab Chandhini",
    role: "Content Manager",
    email: "rihab@example.com",
    phone: "+91 9012345678",
    image: "/team/ravi.jpg",
    linkedin: "",
  },
  {
    name: "Uma Krishna Kanth Chokkapu",
    role: "Backend Engineer",
    email: "ukkukk97@gmail.com",
    phone: "+91 9121505879",
    image: "/team/ravi.jpg",
    linkedin:
      "https://www.linkedin.com/in/chokkapu-uma-krishna-kanth-50a502288/",
  },
  {
    name: "LavaRaju",
    role: "Customer service Manager",
    email: "lavaraju5751@gmail.com",
    phone: "+91 8497981640",
    image: "/team/ravi.jpg",
    linkedin: "https://www.linkedin.com/in/lavaraju-undefined-724448323/",
  },
  {
    name: "Gnana Sri",
    role: "Chief Human Resource Officer",
    email: "gnanasribathina@gmail.com",
    phone: "",
    image: "/team/ravi.jpg",
    linkedin: "",
  },

];

const Contact = () => {
  return (
    <div className="min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-green-600 mb-4">
          Contact Us
        </h1>
        <p className="text-gray-600 text-lg mb-10">
          Meet the team behind <strong>EduAltTech</strong>. Reach out to us
          directly!
        </p>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="bg-green-50 shadow-md rounded-xl p-6 hover:shadow-xl transition-all duration-300"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-md"
              />
              <h3 className="text-xl font-semibold text-green-700 mt-4">
                {member.name}
              </h3>
              <p className="text-green-500 text-sm mb-2">
                {member.role || "Team Member"}
              </p>

              <div className="text-sm text-gray-700 space-y-1 mt-2">
                {member.email && (
                  <p>
                    <span className="font-medium">Email:</span> {member.email}
                  </p>
                )}
                {member.phone && (
                  <p>
                    <span className="font-medium">Phone:</span> {member.phone}
                  </p>
                )}
              </div>

              {member.linkedin && (
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
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;
