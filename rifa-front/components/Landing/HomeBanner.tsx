import {ThemePrincipalButton} from '@/lib/enums/ThemeConfigProvider';
import ButtonG from '@/components/Buttons/ButtonG';
import BackgroundPage from '@/components/Landing/BackgroundPage';
import {Colors} from '@/lib/enums/Colors';
import {useAppContext} from '@/lib/AppContext';

const HomeBanner = ({data}: any) => {
  const {actionButton} = useAppContext();

  if (!data.isActive) {
    return null;
  }
  const imageUrlIntroduction = data?.backgroundImage.data[0].attributes.url;
  const imageAltIntroduction = data?.backgroundImage.data[0].attributes.alternativeText;
  const images = {
    original: imageUrlIntroduction,
    alt: imageAltIntroduction,
  };

  function splitSentence(sentence: string) {
    const parts = sentence.split('! ');
    const firstPart = parts[0] + '!';
    const secondPart = parts[1].trim();

    return {firstPart, secondPart};
  }

  const result = splitSentence(data?.title);

  return (
    <div className="homebanner-container" id="homepage">
      <BackgroundPage images={images || null}>
        <div className="homebanner-children">
          <p className="homebanner-text">{result.firstPart}</p>
          <h1 className="homebanner-tittle">{result.secondPart}</h1>
          <ButtonG
            htmlType={'button'}
            theme={ThemePrincipalButton}
            className={'homebanner-button'}
            handleClick={() => {
              actionButton(data?.suscribeNow.buttonUrl);
            }}
          >
            <span className="generic-text" style={{color: Colors.BLACK}}>
              {data.suscribeNow.buttonText}
            </span>
          </ButtonG>
        </div>
      </BackgroundPage>
    </div>
  );
};

export default HomeBanner;
