import React from 'react';

const Biography = ({ imageUrl }) => {
  return (
    <div className='container biography'>
      <div className="banner">
        <img src={imageUrl} alt="aboutImg" />
      </div>
      <div className="banner">
        <p>Biography</p>
        <h3>Who We Are</h3>
        <p>Welcome to our Institute, where excellence and dedication meet to create exceptional experiences. Established in 2005, our mission has always been to deliver top-notch services and innovative solutions that make a significant impact in our field.</p>
        <p>Our journey began with a small, passionate team determined to make a difference. Over the years, we have grown exponentially, both in size and expertise. Our team comprises professionals from diverse backgrounds, each bringing unique skills and perspectives to the table. This diversity fuels our creativity and drives us to push the boundaries of what’s possible.</p>
        <p>We specialize in Medical Hospitality, providing a wide range of services that cater to the needs of our clients. </p>     
        <p>Looking ahead, we are excited about the future and the opportunities it holds. Our vision is to continue growing and evolving, setting new benchmarks for excellence in our industry. We invite you to join us on this journey and be a part of our story.</p>
        <p>Thank you for your interest in our organization. We look forward to working with you and achieving great things together.</p>
      </div>
    </div>
  );
};

export default Biography;

