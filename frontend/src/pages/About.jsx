// About.jsx
const About = () => {
  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <h2 className="text-3xl sm:text-4xl font-bold text-green-600 mb-10 text-center">
        About EduAltTech
      </h2>

      {/* Description */}
      <section className="mb-12">
        <h3 className="text-2xl font-semibold text-green-500 mb-4">
          Description
        </h3>
        <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-justify">
          EduAltTech is a forward-thinking education platform designed to
          connect skilled individuals with learners who are eager to grow. Built
          on the principles of accessibility and innovation, we focus on
          delivering alternative education through practical learning,
          mentorship, and collaboration. Our mission is to empower learners to
          acquire industry-relevant skills while enabling educators to share
          their expertise and build their professional identity.
        </p>
      </section>

      {/* Photos of the Journey */}
      <section className="mb-12">
        <h3 className="text-2xl font-semibold text-green-500 mb-4">
          Our Journey
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <img
            src="/assets/journey1.jpg"
            alt="EduAltTech early stage"
            className="rounded-lg shadow-md object-cover w-full h-48"
          />
          <img
            src="/assets/journey2.jpg"
            alt="Team collaboration"
            className="rounded-lg shadow-md object-cover w-full h-48"
          />
          <img
            src="/assets/journey3.jpg"
            alt="Community event"
            className="rounded-lg shadow-md object-cover w-full h-48"
          />
        </div>
      </section>

      {/* Achievements */}
      <section className="mb-12">
        <h3 className="text-2xl font-semibold text-green-500 mb-4">
          Achievements
        </h3>
        <ul className="list-disc list-inside text-gray-700 text-base sm:text-lg leading-relaxed">
          <li>
            Reached over 100+ active learners within the first launch phase.
          </li>
          <li>Onboarded experienced educators across multiple domains.</li>
          <li>Introduced peer-to-peer mentorship for continuous guidance.</li>
        </ul>
      </section>

      {/* Success and Collaborations */}
      <section>
        <h3 className="text-2xl font-semibold text-green-500 mb-4">
          Success & Collaborations
        </h3>
        <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-justify">
          EduAltTech has successfully collaborated with educators, industry
          professionals, and student communities to create impactful learning
          experiences. Our collaborative projects have resulted in accessible
          skill-based courses, networking opportunities, and a supportive
          community where learners and providers grow together. As we continue
          to expand, our focus remains on building meaningful partnerships that
          foster success for both learners and educators.
        </p>
      </section>
    </div>
  );
};

export default About;
