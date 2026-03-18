import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4 text-center mt-8">
      <div className="container mx-auto">
        <p>&copy; {new Date().getFullYear()} Smart Expense Tracker. All rights reserved.</p>
      </div>
    </footer>
  );
}
