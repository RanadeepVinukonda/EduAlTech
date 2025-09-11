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
  const [search, setSearch] = useState("");
  const [frequentCourses, setFrequentCourses] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);

  // Fetch lectures by category (Edu / AltEdu)
  useEffect(() => {
    if (!view) return;
    const fetchLectures = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/courses/all?category=${view}`, {
          withCredentials: true,
        });
        setLectures(Array.isArray(res.data) ? res.data : []);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load lectures.");
      } finally {
        setLoading(false);
      }
    };
    fetchLectures();
  }, [view]);

  // Fetch frequent courses
  useEffect(() => {
    const fetchFrequent = async () => {
      try {
        const res = await api.get("/courses/frequently-viewed", {
          withCredentials: true,
        });
        setFrequentCourses(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch frequent courses", err);
        setFrequentCourses([]);
      }
    };
    fetchFrequent();
  }, []);

  // Fetch popular courses
  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await api.get("/courses/popular", {
          withCredentials: true,
        });
        setPopularCourses(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch popular courses", err);
        setPopularCourses([]);
      }
    };
    fetchPopular();
  }, []);

  // Filtered data based on search
  const filteredLectures = lectures.filter(
    (lec) =>
      lec.title?.toLowerCase().includes(search.toLowerCase()) ||
      lec.subject?.toLowerCase().includes(search.toLowerCase())
  );
  const filteredFrequentCourses = frequentCourses.filter(
    (course) =>
      course.title?.toLowerCase().includes(search.toLowerCase()) ||
      course.subject?.toLowerCase().includes(search.toLowerCase())
  );
  const filteredPopularCourses = popularCourses.filter(
    (course) =>
      course.title?.toLowerCase().includes(search.toLowerCase()) ||
      course.subject?.toLowerCase().includes(search.toLowerCase())
  );

  // Group lectures by class and subject
  const groupEduLectures = () => {
    const grouped = {};
    filteredLectures.forEach((lec) => {
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

      {/* Search Section */}
      <div className="mb-8 flex justify-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for a course..."
          className="w-full sm:w-2/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Frequent Courses */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-green-700 mb-4">
          Frequently Viewed Courses
        </h3>
        {filteredFrequentCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFrequentCourses.map((course) => (
              <CourseCard key={course._id} lecture={course} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No frequent courses found.</p>
        )}
      </div>

      {/* Popular Courses */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-green-700 mb-4">
          Popular Courses
        </h3>
        {filteredPopularCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPopularCourses.map((course) => (
              <CourseCard key={course._id} lecture={course} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No popular courses found.</p>
        )}
      </div>

      {/* Category Toggle */}
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

      {/* Edu Courses */}
      {!loading && view === "Edu" && filteredLectures.length > 0 && (
        <div>
          {Object.entries(groupEduLectures()).map(([classLevel, subjects]) => (
            <div key={classLevel} className="mb-10">
              <h3 className="text-2xl font-bold text-green-700 mb-4">
                Class {classLevel}
              </h3>
              {Object.entries(subjects).map(([subject, subLectures]) => (
                <div key={subject} className="mb-6">
                  <h4 className="text-xl font-semibold text-gray-700 mb-2">
                    {subject}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subLectures.map((lec) => (
                      <CourseCard key={lec._id} lecture={lec} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* AltEdu Courses */}
      {!loading && view === "AltEdu" && (
        <>
          {filteredLectures.length === 0 ? (
            <p className="text-center text-gray-600">
              No AltEdu lectures found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLectures.map((l) => (
                <CourseCard key={l._id} lecture={l} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
