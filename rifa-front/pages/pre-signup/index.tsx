import AuthCardSignup from '@/components/AuthCards/AuthCardSignup';
import GoogleCaptchaWrapper from '@/components/Captcha/GoogleCaptchaWrapper';
import PublicLayout from '@/components/Layout/PublicLayout';

const PreSignup = () => {
  return (
    <GoogleCaptchaWrapper>
      <PublicLayout seo={null}>
        <>
          <img className="auth-bg-image" src="/assets/login-bgg.png" />
          <div className="auth-bg-content">
            <h2 className="auth-bg-ttl">Tu momento de ganar es ahora!</h2>
            <div className="auth-card-container">
              <AuthCardSignup />
            </div>
          </div>
        </>
      </PublicLayout>
    </GoogleCaptchaWrapper>
  );
};

export default PreSignup;
