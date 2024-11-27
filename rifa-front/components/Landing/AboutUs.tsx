import {ThemePrincipalButton} from '@/lib/enums/ThemeConfigProvider';
import ButtonG from '../Buttons/ButtonG';
import {Row, Col, Button} from 'antd';
import {useAppContext} from '@/lib/AppContext';

const AboutUs = ({data}: any) => {
  const {actionButton} = useAppContext();
  if (!data.isActive) {
    return null;
  }
  const aboutUsButtonUrl = data.aboutUsButton.buttonUrl;
  return (
    <div className="about-container">
      <Row className="about-inner" gutter={[16, 16]} align="middle">
        <Col xs={{span: 24, order: 1}} md={{span: 12, order: 1}} className="image-container">
          <img
            className="about-image"
            src={data.backgroundImage.data.attributes.url}
            alt={data.backgroundImage.data.attributes.alternativeText}
          />
        </Col>
        <Col xs={{span: 24, order: 2}} md={{span: 12, order: 2}} className="text-container">
          <h2 className="about-title">{data.title}</h2>
          <p className="content">{data.content}</p>
          <ButtonG
            htmlType={'button'}
            theme={ThemePrincipalButton}
            className={'button-strappi'}
            handleClick={() => {
              actionButton(aboutUsButtonUrl);
            }}
          >
            <span className="about-button">{data.aboutUsButton.buttonText}</span>
          </ButtonG>
        </Col>
      </Row>
    </div>
  );
};

export default AboutUs;
