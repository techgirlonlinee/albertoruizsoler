import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import './styles/CaseStudyPage.css';

function CaseStudyPage({ portfolioItems }) {
  const [caseStudy, setCaseStudy] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const selectedCaseStudy = portfolioItems.find(item => item.sys.id === id);
    setCaseStudy(selectedCaseStudy);
  }, [id, portfolioItems]);

  if (!caseStudy) {
    return <div>Loading...</div>;
  }

  // Helper function to extract Vimeo ID from URL
  const extractVimeoID = (url) => {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : null;
  };

  return (
    <div>
      <h1>{caseStudy.fields.title}</h1>
      <div className="content">
        <div className="rich-text">{documentToReactComponents(caseStudy.fields.description)}</div> {/* Render Rich Text */}

        <div className="multimedia">
          {/* Render SoundCloud Tracks */}
          {caseStudy.fields.soundcloudlink && caseStudy.fields.soundcloudlink.map((link, index) => (
            <iframe 
              key={index}
              title={`SoundCloud Audio ${index}`} // ✅ Unique title for each iframe
              width="100%"
              height="166"
              scrolling="no" 
              frameBorder="no" 
              allow="autoplay" 
              src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(link)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
            ></iframe>
          ))}

          {/* Render Images with Descriptions */}
          {caseStudy.fields.media && caseStudy.fields.media.map((image, index) => (
            <div key={index} >
              <div className="image-container">
              <img 
                src={image.fields.file.url} 
                alt={image.fields.description || 'Case Study Image'} 
              />
            </div>
            {image.fields.description && (
                <p className="image-description">{image.fields.description}</p>
              )}
            </div>
          ))}

          {/* Render Vimeo Videos */}
          {caseStudy.fields.videolink && caseStudy.fields.videolink.map((link, index) => (
            <div className="video-wrapper" key={index}>
              <iframe 
                className="video-iframe"
                title={`Vimeo Video ${index}`} // ✅ Unique title for each iframe
                src={`https://player.vimeo.com/video/${extractVimeoID(link)}`} 
                frameBorder="0"
                allow="autoplay; fullscreen" 
                allowFullScreen
              ></iframe>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CaseStudyPage;
