import Image from 'next/legacy/image';
import {Row, Col} from 'antd';

const BackgroundPage = ({images, children}: any) => {
  return (
    <div className="homebanner-bg-container">
      <div className="homebanner-bg-image">
        <Image
          alt={images.alt}
          src={images.original}
          layout="fill"
          objectFit="cover"
          objectPosition="right"
          quality={100}
          priority
        />
      </div>

      <Row className="homebanner-children-position">
        <Col span={24} offset={0}>
          {children}
        </Col>
      </Row>
    </div>
  );
};

export default BackgroundPage;
