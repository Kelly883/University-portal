interface FlutterwaveConfig {
  publicKey: string;
  tx_ref: string;
  amount: number;
  currency: string;
  payment_options: string;
  customer: {
    email: string;
    phone_number: string;
    name: string;
  };
  customizations: {
    title: string;
    description: string;
    logo: string;
  };
}

declare global {
  interface Window {
    FlutterwaveCheckout: (config: FlutterwaveConfig) => void;
  }
}

const useFlutterwave = (config: FlutterwaveConfig) => {
  return () => {
    window.FlutterwaveCheckout({
      ...config,
      callback: (response) => {
        console.log(response);
      },
      onclose: () => {},
    });
  };
};

export default useFlutterwave;
