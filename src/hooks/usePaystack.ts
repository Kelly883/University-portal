interface PaystackConfig {
  publicKey: string;
  email: string;
  amount: number;
  ref: string;
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: {
        key: string;
        email: string;
        amount: number;
        ref: string;
        onClose: () => void;
        callback: (response: any) => void;
      }) => {
        openIframe: () => void;
      };
    };
  }
}

const usePaystack = (config: PaystackConfig) => {
  return () => {
    const handler = window.PaystackPop.setup({
      key: config.publicKey,
      email: config.email,
      amount: config.amount,
      ref: config.ref,
      onClose: () => {},
      callback: (response) => {
        console.log(response);
      },
    });
    handler.openIframe();
  };
};

export default usePaystack;
