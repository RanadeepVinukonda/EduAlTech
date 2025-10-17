// src/pages/Subscribe.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import api from "../axios";

const Subscribe = () => {
  const { id } = useParams(); // course ID
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/course/${id}`);
        setCourse(res.data);
      } catch (err) {
        setError("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleSubscribe = async () => {
    setSubmitting(true);
    try {
      const res = await api.post(`/course/${id}/subscribe`);
      alert(res.data.message || "Subscription successful!");
      navigate(`/course/${id}`); // redirect to course page
    } catch (err) {
      alert(
        err.response?.data?.error || "Subscription failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-primary mb-4">
          Subscribe to {course?.title || "this course"}
        </h2>
        <p className="text-gray-600 mb-6">
          Price:{" "}
          <span className="font-semibold">{course?.price || "Free"}</span>
        </p>
        <p className="text-gray-700 mb-6">{course?.description}</p>

        <button
          onClick={handleSubscribe}
          disabled={submitting}
          className="btn btn-success w-full"
        >
          {submitting ? "Processing..." : "Subscribe & Access Course"}
        </button>

        <p className="text-sm text-gray-500 mt-4">
          After subscribing, you will get full access to all lectures.
        </p>
      </div>
    </div>
  );
};

export default Subscribe;
