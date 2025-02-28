import React, { useState, useEffect } from 'react';
import { createClient } from 'contentful';
import { HashRouter as Router, Route, Routes } from 'react-router-dom'; // ✅ Use HashRouter for GitHub Pages
import CaseStudyPage from './CaseStudyPage';
import HomePage from './HomePage';
import AboutPage from './AboutPage'; 
import NavBar from './NavBar';
import Footer from './Footer';
import CaseStudyList from './CaseStudyList';
import CalendarPage from './CalendarPage';

// ✅ Use environment variables for Contentful API credentials
const spaceId = process.env.REACT_APP_CONTENTFUL_SPACE_ID;
const accessToken = process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN;

const client = createClient({
  space: spaceId,
  accessToken: accessToken
});

function App() {
  const [portfolioItems, setPortfolioItems] = useState({ featured: [], dance: [], other: [] });

  useEffect(() => {
    client.getEntries({ content_type: 'caseStudy' })
      .then((response) => {
        const featured = response.items.filter(item => item.fields.isFeatured);
        const dance = response.items.filter(item => item.fields.isDance);
        const other = response.items.filter(item => !item.fields.isDance);

        setPortfolioItems({ featured, dance, other });
      })
      .catch(console.error);
  }, []); // ✅ Only run once when the component mounts

  return (
    <Router>
      <NavBar />
      <div>
        <Routes>
          <Route path="/" element={<HomePage featuredItems={portfolioItems.featured} />} />
          <Route path="/case-study/:id" element={<CaseStudyPage portfolioItems={[...portfolioItems.featured, ...portfolioItems.dance, ...portfolioItems.other]} />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>

        {/* ✅ Fixed class -> className */}
        <div className="case-study-section">
          <h3>Index</h3>
          <div className="case-study-list">
            <CaseStudyList categoryTitle="Dance & Theatre" items={portfolioItems.dance} />
            <CaseStudyList categoryTitle="Audiovisual Works" items={portfolioItems.other} />
          </div>
        </div>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
