import AuthCardLogin from '@/components/AuthCards/AuthCardLogin';
import PublicLayout from '@/components/Layout/PublicLayout';

const Signin = () => {
  return (
    <PublicLayout seo={null}>
      <img className="auth-bg-image" src="/assets/login-bgg.png" />
      <div className="auth-bg-content">
        <h2 className="auth-bg-ttl">Tu momento de ganar es ahora!</h2>
        <div className="auth-card-container">
          <AuthCardLogin />
        </div>
      </div>
    </PublicLayout>
  );
};

export default Signin;
