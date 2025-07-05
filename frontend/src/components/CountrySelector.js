import React from "react";

const countries = [
  { name: "Bahrain", flag: "🇧🇭" },
  { name: "Qatar", flag: "🇶🇦" },
  { name: "Kuwait", flag: "🇰🇼" },
  { name: "Oman", flag: "🇴🇲" },
  { name: "Saudi Arabia", flag: "🇸🇦" },
  { name: "United Arab Emirates", flag: "🇦🇪" },
  { name: "Egypt", flag: "🇪🇬" },
];

export default function CountrySelector() {
  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div className="text-2xl font-bold text-purple-700">
          <span className="text-4xl">🅓</span>4D ONLINE
        </div>
        <div className="text-sm text-gray-600">English / العربية ⌄</div>
      </div>

      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Select your country</h1>
        <p className="text-gray-500 mt-2">Find all shopping flyers in one place</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {countries.map((c, i) => (
          <div
            key={i}
            className="bg-white shadow-md rounded-xl flex flex-col items-center justify-center py-6 hover:shadow-xl transition"
          >
            <div className="text-5xl">{c.flag}</div>
            <div className="mt-4 text-lg font-medium">{c.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
