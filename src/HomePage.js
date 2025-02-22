import React from 'react';
import { Link } from 'react-router-dom';
import './styles/HomePage.css'; // Ensure this points to the correct path of your CSS file

function HomePage({ featuredItems }) {
  if (!featuredItems) {
    return <div>Loading...</div>;
  }

  // Split featuredItems into pairs
  const pairedItems = [];
  for (let i = 0; i < featuredItems.length; i += 2) {
    pairedItems.push(featuredItems.slice(i, i + 2));
  }

  return (
<div className="featured-projects">
  <h1>Selected works</h1>
  {pairedItems.map((pair, rowIndex) => (
    <div className="featured-row" key={rowIndex}>
      {pair.map((item, index) => (
        <div 
          className="featured-item" 
          key={item.sys.id} 
          style={{ flexBasis: rowIndex % 2 === 0 ? (index === 0 ? '65%' : '35%') : '50%' }}
        >
          {/* <Link to={`/case-study/${item.sys.id}`}>
            <div 
              className="image-container"
              style={{ backgroundImage: `url(${item.fields.coverImg?.fields.file.url})` }}
              aria-label={item.fields.coverImg?.fields.description || "Project image"}
            />
            <div className="image-text">
            {item.fields.coverImg?.fields.description && (
              <p className="image-description">{item.fields.coverImg.fields.description}</p>
            )}
            <p>{item.fields.oneLiner}</p>
            </div>
          </Link> */}
          <Link to={`/case-study/${item.sys.id}`}>
  <div className="image-container" style={{ backgroundImage: `url(${item.fields.coverImg?.fields.file.url})` }}>
    {/* Accessible img tag with alt text */}
    <img 
      src={item.fields.coverImg?.fields.file.url} 
      alt={item.fields.coverImg?.fields.description || "Project image"} 
      className="sr-only" 
    />
  </div>
  <div className="image-text">
    {item.fields.coverImg?.fields.description && (
      <p className="image-description">{item.fields.coverImg.fields.description}</p>
    )}
    <p>{item.fields.oneLiner}</p>
  </div>
</Link>

        </div>
      ))}
    </div>
  ))}
</div>

  );
}


export default HomePage;

