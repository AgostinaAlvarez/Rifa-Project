import RifaLogo from './RifaLogo';

const WordMark = ({color, label}: any) => {
  return (
    <div className="row-component">
      <RifaLogo color={color} />
      {label}
    </div>
  );
};

export default WordMark;
