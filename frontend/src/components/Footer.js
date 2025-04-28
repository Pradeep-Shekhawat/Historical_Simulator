import React from 'react';
const linkedinurl = process.env.REACT_APP_LINKEDIN_URL;
const githuburl = process.env.REACT_APP_GITHUB_URL;

export default function Footer() {
  return (
    <footer className="app-footer">
      <p>© {new Date().getFullYear()} Historical Simulator. All rights reserved.</p>
      <div className="social-links">
        <a href={linkedinurl} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        {' • '}
        <a href={githuburl} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </div>
    </footer>
  );
}