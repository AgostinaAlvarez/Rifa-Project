import React from 'react';
import Slider from 'react-slick';

interface CarouselProps {
  images: Array<{
    awardImage: any;
    original: string;
    alt: string;
  }>;
}

const Carousel = ({images}: CarouselProps) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Default setting for desktop
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: 'linear',
    arrows: false,
    centerMode: true,
    dotsClass: 'custom-dots',
    responsive: [
      {
        breakpoint: 1024, // Tablet and above
        settings: {
          slidesToShow: 2, // Show 2 slides on tablets
        },
      },
      {
        breakpoint: 760, // Mobile devices
        settings: {
          slidesToShow: 1, // Show only 1 slide on mobile
          dots: false,
        },
      },
    ],
  };

  return (
    <Slider {...settings}>
      {images &&
        images.map((item) => {
          let index = item.awardImage.data.id;
          return (
            <div key={index} className="main-awards-img">
              <img
                src={item.awardImage.data.attributes.url}
                alt={item.awardImage.data.attributes.alternativeText}
              />
            </div>
          );
        })}
    </Slider>
  );
};

export default Carousel;
