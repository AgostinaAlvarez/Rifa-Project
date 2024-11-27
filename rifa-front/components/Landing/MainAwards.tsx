import Carousel from '@/components/Landing/Carousel';

const MainAwards = ({data, mainAwardsImages}: any) => {
  if (!data.isActive) {
    return null;
  }

  return (
    <div className="main-awards-container">
      <h1 className="main-awards-title">{data.title}</h1>
      <div className="main-awards-title-underline"></div>
      <Carousel images={mainAwardsImages} />
    </div>
  );
};

export default MainAwards;
