import React from 'react';
import Slider from 'react-slick';
import ImageContainer from '@/components/Images/ImageContainer';

interface CarouselProps {
  images: Array<{
    awardImage: any;
    description: string;
    title: string;
    original: string;
    alt: string;
  }>;
}

const CarouselAux = ({images}: CarouselProps) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: 'linear',
    arrows: false,
    centerMode: true,
    dotsClass: 'custom-dots',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 760,
        settings: {
          slidesToShow: 1,
          dots: false,
        },
      },
    ],
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {images &&
          images.map((item) => {
            let index = item.awardImage.data.id;

            const image = {
              original: item.awardImage.data.attributes.url,
              alt: item.awardImage.data.attributes.alternativeText,
            };

            return (
              <div key={index}>
                <div className="weekly-div-container">
                  <ImageContainer image={image} className={'weekly-img-container'} />
                  <div className="weekly-modal">
                    <h4 className="weekly-title">{item.title}</h4>
                    <p className="weekly-text">{item.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
      </Slider>
    </div>
  );
};

export default CarouselAux;
