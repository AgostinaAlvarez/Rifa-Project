import classnames from 'classnames';

export const paymentClass = ({isReady}: any) => {
  return classnames('payment-form dark', {
    'payment-form--hidden': !isReady,
  });
};

export const customization = {
  paymentMethods: {
    maxInstallments: 1,
  },
  visual: {
    style: {
      theme: 'dark',
      customVariables: {
        formBackgroundColor: '181818',
        baseColor: '#8CEF7A',
      },
    },
  },
};

export const initialization = {
  amount: 9900,
};
