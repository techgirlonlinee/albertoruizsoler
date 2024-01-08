import React, { useState, useEffect } from 'react';
import { createClient } from 'contentful';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CaseStudyPage from './CaseStudyPage';
import HomePage from './HomePage';
import AboutPage from './AboutPage'; 
import NavBar from './NavBar';
import Footer from './Footer';
import CaseStudyList from './CaseStudyList';
import CalendarPage from './CalendarPage'; // Adjust the path if necessary

// Use environment variables for space ID and access token
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

        setPortfolioItems({
          featured: featured,
          dance: dance,
          other: other
        });
      })
      .catch(console.error);
  }, []);

  return (
    <Router>
      <NavBar />
      <div>
        <Routes>
          <Route path="/" element={<HomePage featuredItems={portfolioItems.featured} />} />
          <Route path="/case-study/:id" element={<CaseStudyPage portfolioItems={[...portfolioItems.dance, ...portfolioItems.other]} />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
        <div class="case-study-section">
          <h3>Index</h3>
          <div class="case-study-list">
          <CaseStudyList categoryTitle="Dance & theatre" items={portfolioItems.dance} />
          <CaseStudyList categoryTitle="Audiovisual works" items={portfolioItems.other} />
          </div>
        </div>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
