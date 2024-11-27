const Steps = ({data}: any) => {
  if (!data.isActive) {
    return null;
  }

  return <h1>BloqueSteps</h1>;
};

export default Steps;
