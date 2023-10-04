import React, { useState, useEffect } from "react";


function BackgroundTransition({ images, duration, ...props }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, duration);

    return () => clearInterval(interval);
  }, [images, duration]);

  return (
    <div
      style={{
        backgroundImage: `url(${images[currentImageIndex]})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPositionY: "70%",
        transition: "background-image 1.5s ease-in-out",
        minHeight: "100vh",
      }}
      className="fade-background"
    >
      {props.children}
    </div>
  );
}

export default BackgroundTransition;
