import Card from '@/components/Landing/Card';
import {Row, Col} from 'antd';
import {CardType} from '@/types/components';

const ExclusiveBenefits = ({data}: any) => {
  if (!data.isActive) {
    return null;
  }
  return (
    <div className="exclusiveBenefits-main-container">
      <Row gutter={[16, 16]} align="middle" className="benefitsMainRow">
        <Col xs={24} lg={12}>
          <Row justify="center" align="middle">
            <Col>
              <div className="exclusiveBenefits-content">
                <h2>{data.title}</h2>
                <p className="benefitsTextContent">{data.content}</p>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} lg={12}>
          <div className="benefitsCard-container">
            {data.cards?.map(
              (card: CardType, index: number) =>
                card.isActive && (
                  <Card key={index}>
                    <img
                      src={card.benefitCardImage?.data?.attributes?.url}
                      alt={card.benefitCardImage?.data?.attributes?.alternativeText}
                    />
                    <p>{card.benefitDescription}</p>
                  </Card>
                )
            )}
          </div>
        </Col>
      </Row>
      <div className="gradient-overlay"></div>
    </div>
  );
};

export default ExclusiveBenefits;
