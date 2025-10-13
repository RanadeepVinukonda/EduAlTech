// Contact.jsx
import React from "react";
import { FaLinkedin } from "react-icons/fa";
import umaImg from "../assets/team/uma.jpeg";
import chandhiniImg from "../assets/team/chandhiniimg.jpeg";
import ranadeepImg from "../assets/team/ranadeepimg2.jpeg";
import gnanaImg from "../assets/team/gnanaimg.jpeg";
import lavarajImg from "../assets/team/lavarajimg.jpeg";
import satishImg from "../assets/team/satishimg.jpeg";
import sandeepImg from "../assets/team/sandeepimg.jpeg";

const teamMembers = [
  {
    name: "Al Rihab Chandhini",
    role: "Chief Executive Officer",
    email: "alrihabchandhinimohammed@gmail.com",
    phone: "+91 80191 25121",
    image: chandhiniImg,
    linkedin: "https://www.linkedin.com/in/al-rihab-chandhini-4b3b25228/",
  },
  {
    name: "Uma Krishna Kanth Chokkapu",
    role: "Chief Financial Officer",
    email: "ukkukk97@gmail.com",
    phone: "+91 9121505879",
    image: umaImg,
    linkedin:
      "https://www.linkedin.com/in/chokkapu-uma-krishna-kanth-50a502288/",
  },
  {
    name: "Ranadeep Vinukonda",
    role: "Chief Technology Officer",
    email: "viranadeep@gmail.com",
    phone: "+91 8919473722",
    image: ranadeepImg,
    linkedin: "https://www.linkedin.com/in/ranadeepvinukonda",
  },
  {
    name: "Satyanarayana Akula",
    role: "Chief Operating Officer",
    email: "akulasatish49@gmail.com",
    phone: "+91 9876543210",
    image: satishImg,
    linkedin: "https://www.linkedin.com/in/satyanarayana-akula-785565304/",
  },
  {
    name: "Kakara Sandeep",
    role: "Chief Marketing Officer",
    email: "sandeepkakara2005@gmail.com",
    phone: "+91 93461 05182",
    image: sandeepImg,
    linkedin: "https://www.linkedin.com/in/kakara-sandeep-63b6952b8/",
  },
  {
    name: "LavaRaju",
    role: "Customer Service Manager",
    email: "lavaraju5751@gmail.com",
    phone: "+91 8497981640",
    image: lavarajImg,
    linkedin: "https://www.linkedin.com/in/lavaraju-undefined-724448323/",
  },
  {
    name: "Gnana Sri",
    role: "Chief Human Resource Officer",
    email: "gnanasribathina@gmail.com",
    phone: "+91 75691 97763",
    image: gnanaImg,
    linkedin:
      "https://www.linkedin.com/in/bathina-gnana-sri-lakshmi-52705432a/",
  },
];

const Contact = () => {
  // Duplicate members array to make seamless auto scroll
  const scrollingMembers = [...teamMembers, ...teamMembers];

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

        {/* AUTO SCROLL HORIZONTAL CARDS */}
        <div className="relative w-full overflow-hidden">
          <div className="flex gap-6 animate-scroll whitespace-nowrap">
            {scrollingMembers.map((member, idx) => (
              <div
                key={idx}
                className="inline-block min-w-[260px] sm:min-w-[300px] bg-green-50 shadow-md rounded-xl p-6 hover:shadow-xl transition-all duration-300"
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
    </div>
  );
};

export default Contact;
