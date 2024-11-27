import ChangePasswordForm from '@/components/Forms/ChangePasswordForm';
import PublicLayout from '@/components/Layout/PublicLayout';

const PasswordReset = () => {
  return (
    <PublicLayout seo={null}>
      <>
        <img className="auth-bg-image" src="/assets/login-bgg.png" />
        <div className="auth-bg-content">
          <h2 className="auth-bg-ttl">Tu momento de ganar es ahora!</h2>
          <div className="auth-card-container">
            <ChangePasswordForm />
          </div>
        </div>
      </>
    </PublicLayout>
  );
};

export default PasswordReset;
