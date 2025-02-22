import React, { useState, useEffect } from 'react';
import { createClient } from 'contentful';
import './styles/CalendarPage.css'; // Make sure the path is correct

// Use environment variables for Contentful access
const spaceId = process.env.REACT_APP_CONTENTFUL_SPACE_ID;
const accessToken = process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN;

const client = createClient({
    space: spaceId,
    accessToken: accessToken
});

function CalendarPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    client.getEntries({ content_type: 'caseStudy' })
      .then(response => {
        const projectsWithDates = response.items.map(item => {
          if (typeof item.fields.eventDates === 'string') {
            try {
              item.fields.eventDates = JSON.parse(item.fields.eventDates);
            } catch (error) {
              console.error('Error parsing eventDates:', error);
            }
          }
          return item;
        });

        setProjects(projectsWithDates);
      })
      .catch(console.error);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    return `${day} ${month}`;
  };

  const formatEventDate = (dateEntry) => {
    if (typeof dateEntry === 'string') {
      return formatDate(dateEntry);
    } else if (dateEntry.start && dateEntry.end) {
      const startDate = new Date(dateEntry.start);
      const endDate = new Date(dateEntry.end);

      if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
        return `${startDate.getDate()}-${endDate.getDate()} ${startDate.toLocaleString('en-US', { month: 'long' })}`;
      } else {
        return `${formatDate(dateEntry.start)} - ${formatDate(dateEntry.end)}`;
      }
    }
    return '';
  };

  const flattenProjects = (projects) => {
    let flattened = [];

    projects.forEach(project => {
      project.fields.eventDates?.dates.forEach(event => {
        const dateKey = typeof event === 'string' ? event : event.start;
        const year = new Date(dateKey).getFullYear();
        const location = event.location || "Unknown Location"; // Default if missing

        flattened.push({
          year,
          dateKey,
          formattedDate: formatEventDate(event),
          location,
          project
        });
      });
    });

    return flattened;
  };

  const flattenedProjects = flattenProjects(projects);
  const groupedByYear = flattenedProjects.reduce((acc, item) => {
    if (!acc[item.year]) {
      acc[item.year] = [];
    }
    acc[item.year].push(item);
    return acc;
  }, {});

  const sortedYears = Object.keys(groupedByYear).sort((a, b) => b - a);

  return (
    <>
      <h1>Calendar</h1>
      <div className="calendar-container">
        {sortedYears.map((year, index) => {
          const additionalClass = index >= 2 ? 'year-section-margin' : '';
          const sortedEvents = groupedByYear[year].sort((a, b) => new Date(a.dateKey) - new Date(b.dateKey));

          return (
            <div key={year} className={`year-section ${additionalClass}`}>
              <h2>{year}</h2>
              {sortedEvents.map(({ formattedDate, location, project }) => (
                <div key={`${formattedDate}-${location}-${project.sys.id}`} className="date-row">
                  <p className="event-date">{formattedDate}</p>
                  <p className="show-title">{project.fields.title}</p>
                  <p className="location-name">{location}</p>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default CalendarPage;
