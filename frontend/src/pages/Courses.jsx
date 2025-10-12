import React, { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import api from "../axios";

const Courses = () => {
  const [lectures, setLectures] = useState([]);
  const [filteredLectures, setFilteredLectures] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("Edu");
  const [classLevel, setClassLevel] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch all lectures using axios
  useEffect(() => {
    const fetchLectures = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/courses/all");

        if (Array.isArray(data)) {
          setLectures(data);
          setFilteredLectures(data.filter((l) => l.category === "Edu"));
        }
      } catch (err) {
        console.error("Failed to load lectures:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, []);

  // Debounced search and filters
  useEffect(() => {
    const timeout = setTimeout(() => {
      let filtered = lectures.filter((l) => l.category === category);

      if (classLevel)
        filtered = filtered.filter(
          (l) => l.classLevel?.toLowerCase() === classLevel.toLowerCase().trim()
        );

      if (subject)
        filtered = filtered.filter((l) =>
          l.subject?.toLowerCase().includes(subject.toLowerCase().trim())
        );

      if (searchTerm)
        filtered = filtered.filter(
          (l) =>
            l.title?.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
            l.course?.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
            l.subject?.toLowerCase().includes(searchTerm.toLowerCase().trim())
        );

      setFilteredLectures(filtered);
    }, 400); // debounce for smoother UX

    return () => clearTimeout(timeout);
  }, [searchTerm, category, classLevel, subject, lectures]);

  return (
    <div className="min-h-screen bg-neutral py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-semibold text-green-700 mb-8">
          Explore Courses
        </h1>

        {/* Tabs for Category */}
        <div className="tabs mb-8">
          <button
            onClick={() => setCategory("Edu")}
            className={`tab tab-bordered ${
              category === "Edu"
                ? "tab-active text-green-700 font-semibold"
                : ""
            }`}
          >
            Education
          </button>
          <button
            onClick={() => setCategory("Alt")}
            className={`tab tab-bordered ${
              category === "Alt"
                ? "tab-active text-green-700 font-semibold"
                : ""
            }`}
          >
            Alternative Education
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search by title, subject, or course"
            className="input input-bordered w-full md:flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {category === "Edu" && (
            <>
              <input
                type="text"
                placeholder="Class Level (e.g. 10th)"
                className="input input-bordered w-full md:w-40"
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value)}
              />

              <input
                type="text"
                placeholder="Subject (e.g. Math)"
                className="input input-bordered w-full md:w-40"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center text-gray-500 py-20">
            Loading courses...
          </div>
        ) : filteredLectures.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLectures.map((lecture) => (
              <CourseCard key={lecture._id} lecture={lecture} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-20">
            No courses found for your filters.
          </div>
        )}
      </div>
    </div>
  );  
};

export default Courses;
