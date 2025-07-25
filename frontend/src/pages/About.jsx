const About = () => {
  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h2 className="text-3xl sm:text-4xl font-bold text-green-600 mb-6 text-center">
        About EduAltTech
      </h2>
      <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-justify">
        <strong>EduAltTech</strong> is an innovative platform created to bridge
        the gap between skillful individuals and enthusiastic learners. We are
        committed to promoting
        <span className="text-green-600 font-semibold">
          {" "}
          alternative education
        </span>{" "}
        using modern technologies, peer-led courses, and community-driven
        knowledge sharing. Whether you're a professional looking to share your
        expertise or a student aiming to upgrade your skills, EduAltTech
        provides the ideal space to grow, teach, and learn.
      </p>
    </div>
  );
};

export default About;
