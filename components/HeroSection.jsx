export default function HeroSection() {
  return (
    <section className="relative py-32 bg-gradient-to-r from-blue-600 to-blue-400 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] bg-cover opacity-10"></div>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Track Your Portfolio Like a{" "}
            <span className="text-yellow-300">Pro</span>
          </h1>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Join over <span className="font-semibold">50,000+</span> investors
            using our simple yet powerful tools to manage their investments and
            grow their wealth
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition duration-300">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
              Get Started
            </button>
            <button className="flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition duration-300">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
              Sign up
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
