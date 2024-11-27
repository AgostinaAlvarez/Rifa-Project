const PlansIntroduction = ({data}: any) => {
  if (!data.isActive) {
    return null;
  }

  return <h1>BloquePlanIntroduction</h1>;
};

export default PlansIntroduction;
