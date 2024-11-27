import CarouselAux from '@/components/Landing/CarouselAux';

const WeeklyAwards = ({data, weeklyImages}: any) => {
  if (!data.isActive) {
    return null;
  }

  return (
    <div className="weekly-awards-container">
      <h1 className="weekly-awards-title">{data.title}</h1>
      <div className="weekly-awards-title-underline"></div>
      <CarouselAux images={weeklyImages} />
    </div>
  );
};

export default WeeklyAwards;
