import {Row, Col} from 'antd';

const Introduction = ({data}: any) => {
  if (!data.isActive) {
    return null;
  }

  const imageUrlIntroduction = data.backgroundImage.data.attributes.url;
  const imageAltIntroduction = data.backgroundImage.data.attributes.alternativeText;

  return (
    <div className="introduction-container">
      <Row justify="center" align="middle">
        <Col xs={{span: 24, order: 2}} md={{span: 12, order: 1}}>
          <img
            className="introduction-bg-image"
            src={imageUrlIntroduction}
            alt={imageAltIntroduction}
          />
        </Col>
        <Col xs={{span: 24, order: 1}} md={{span: 12, order: 2}}>
          <div className="introduction-text-container">
            <h2 className="introduction-title">{data.title}</h2>
            <br />
            <p className="introduction-content">{data.content}</p>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Introduction;
