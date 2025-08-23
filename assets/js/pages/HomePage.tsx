import React from "react";
import { Link } from "@inertiajs/react";

const HomePage = () => {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-undp-blue to-undp-sky p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-blue-50 mb-6 text-center">
            Welcome to the Home Page!
          </h1>
          <p className="text-xl text-white/90 mb-8 text-center leading-relaxed">
            This is the home page of our application.
          </p>
          <div className="flex justify-center">
            <Link
              href="/about"
              className="bg-white text-undp-blue px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg"
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
