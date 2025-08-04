// src/pages/Courses.jsx
import React, { useEffect, useState } from "react";
import api from "../axios";
import CourseCard from "../components/CourseCard";
import Loader from "../components/Loader";

export default function Courses() {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState("");

  useEffect(() => {
    if (view === "") return;

    setLoading(true);
    api
      .get(`/courses/all?category=${view}`, { withCredentials: true })
      .then((res) => {
        setLectures(res.data);
        setError("");
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load lectures.");
      })
      .finally(() => setLoading(false));
  }, [view]);

  const groupEduLectures = () => {
    const grouped = {};
    lectures.forEach((lec) => {
      const classLevel = lec.classLevel || "Unknown Class";
      const subject = lec.subject || "General";

      if (!grouped[classLevel]) grouped[classLevel] = {};
      if (!grouped[classLevel][subject]) grouped[classLevel][subject] = [];
      grouped[classLevel][subject].push(lec);
    });
    return grouped;
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-green-600 text-center mb-8">
        Explore Lectures
      </h2>

      <div className="flex flex-col sm:flex-row justify-center gap-6 mb-10">
        <div
          className={`border-2 p-6 rounded-xl text-center cursor-pointer w-full sm:w-1/2 hover:bg-green-100 ${
            view === "Edu" ? "border-green-600" : "border-gray-300"
          }`}
          onClick={() => setView("Edu")}
        >
          <h3 className="text-xl font-semibold text-green-600">
            Formal Education (Edu)
          </h3>
          <p className="text-sm mt-2 text-gray-500">
            Structured by Class, Subject, and Course
          </p>
        </div>

        <div
          className={`border-2 p-6 rounded-xl text-center cursor-pointer w-full sm:w-1/2 hover:bg-green-100 ${
            view === "AltEdu" ? "border-green-600" : "border-gray-300"
          }`}
          onClick={() => setView("AltEdu")}
        >
          <h3 className="text-xl font-semibold text-green-600">
            Alternative Education (AltEdu)
          </h3>
          <p className="text-sm mt-2 text-gray-500">
            Freelancing, AI, Career Skills, and More
          </p>
        </div>
      </div>

      {loading && <Loader />}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && view === "Edu" && lectures.length > 0 && (
        <div>
          {Object.entries(groupEduLectures()).map(([classLevel, subjects]) => (
            <div key={classLevel} className="mb-10">
              <h3 className="text-2xl font-bold text-green-700 mb-4">
                Class {classLevel}
              </h3>
              {Object.entries(subjects).map(([subject, lectures]) => (
                <div key={subject} className="mb-6">
                  <h4 className="text-xl font-semibold text-gray-700 mb-2">
                    {subject}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lectures.map((lec) => (
                      <CourseCard key={lec._id} lecture={lec} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {!loading && view === "AltEdu" && (
        <>
          {lectures.length === 0 ? (
            <p className="text-center text-gray-600">
              No AltEdu lectures found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {lectures.map((l) => (
                <CourseCard key={l._id} lecture={l} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
