import React, { useState, useEffect } from 'react';
import { createClient } from 'contentful';
import './styles/CalendarPage.css'; // Make sure the path is correct

// Use environment variables for space ID and access token
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

      // Check if start and end dates are in the same month
      if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
        const startDay = startDate.getDate();
        const endDay = endDate.getDate();
        const month = startDate.toLocaleString('en-US', { month: 'long' });
        return `${startDay}-${endDay} ${month}`;
      } else {
        const startDateFormatted = formatDate(dateEntry.start);
        const endDateFormatted = formatDate(dateEntry.end);
        return `${startDateFormatted} - ${endDateFormatted}`;
      }
    }
    return '';
  };

  const groupProjectsByYearAndDate = (projects) => {
    const groupedByYear = {};

    projects.forEach(project => {
      project.fields.eventDates?.dates.forEach(dateEntry => {
        let dateKey = typeof dateEntry === 'string' ? dateEntry : dateEntry.start;
        const year = new Date(dateKey).getFullYear();

        if (!groupedByYear[year]) {
          groupedByYear[year] = {};
        }
        if (!groupedByYear[year][dateKey]) {
          groupedByYear[year][dateKey] = [];
        }

        groupedByYear[year][dateKey].push({ project, dateEntry });
      });
    });

    return groupedByYear;
  };

  const projectsGrouped = groupProjectsByYearAndDate(projects);
  const sortedYears = Object.keys(projectsGrouped).sort((a, b) => b - a);

  return (
    <>
    <h1>Calendar</h1>
    <div className="calendar-container">

      {sortedYears.map((year, index) => {
        const additionalClass = index >= 2 ? 'year-section-margin' : '';
        const sortedDates = Object.keys(projectsGrouped[year]).sort((a, b) => new Date(b) - new Date(a));

        return (
          <div key={year} className={`year-section ${additionalClass}`}>
            <h2>{year}</h2>
            {sortedDates.map(dateKey => {
              const isRange = typeof projectsGrouped[year][dateKey][0].dateEntry === 'object';
              const displayDate = isRange ? 
                formatEventDate(projectsGrouped[year][dateKey][0].dateEntry) : 
                formatDate(dateKey);

              return (
                <div key={dateKey} className="date-value">
                  <p>{displayDate}</p>
                  <ul>
                    {projectsGrouped[year][dateKey].map(({ project, dateEntry }) => (
                      <li key={project.sys.id}>
                        {project.fields.title} – {project.fields.location}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
    </>
  );
}

export default CalendarPage;
