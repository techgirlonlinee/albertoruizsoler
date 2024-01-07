import React from 'react';
import { Link } from 'react-router-dom';
import './styles/CaseStudyList.css'; // Adjust this path to your CSS file

function CaseStudyList({ categoryTitle, items }) {
  if (!items || items.length === 0) {
    return <div>No case studies in {categoryTitle}.</div>;
  }

  // Check if all items have isDance true
  const allDance = items.every(item => item.fields.isDance);

  return (
    <div className="container"> 
      <h2>{categoryTitle}</h2>
      <ul className={allDance ? "dance-case-studies" : "other-case-studies"}>
        {items.map(item => (
          <li key={item.sys.id}>
            <Link to={`/case-study/${item.sys.id}`}>{item.fields.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CaseStudyList;
