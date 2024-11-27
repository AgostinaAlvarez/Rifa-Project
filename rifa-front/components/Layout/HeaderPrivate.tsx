import React from 'react';

const HeaderPrivate = ({user, plan, title}: any) => {
  return (
    <div className="header">
      <div className="header-content">
        {title ? (
          <h1 className="ttl-header">{title}</h1>
        ) : (
          <>
            <div className="container-welcome">
              <img src="" className="imgProfile" alt="Imagen de perfil del usuario" />
              <div>
                <h1>Bienvenido de nuevo {user}</h1>
                <h2>Plan {plan}</h2>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HeaderPrivate;
