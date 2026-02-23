import axios from "axios";
// import Flutterwave from 'flutterwave-node-v3'; // CommonJS module issues in Next.js sometimes, using axios for direct control is safer for serverless

const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY!;
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

// Types
interface PaymentInitiation {
  email: string;
  name: string;
  amount: number;
  currency?: string;
  callbackUrl: string;
  metadata?: any;
}

interface PaymentResponse {
  checkoutUrl: string;
  transactionId?: string; // Provider's reference
  reference: string; // Our reference
}

export const initializeFlutterwavePayment = async (
  data: PaymentInitiation,
  reference: string
): Promise<PaymentResponse> => {
  try {
    const response = await axios.post(
      "https://api.flutterwave.com/v3/payments",
      {
        tx_ref: reference,
        amount: data.amount,
        currency: data.currency || "NGN",
        redirect_url: data.callbackUrl,
        customer: {
          email: data.email,
          name: data.name,
        },
        meta: data.metadata,
        customizations: {
          title: "Titan University Payment",
          logo: "https://titan-university.com/logo.png", // Replace with actual logo
        },
      },
      {
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status === "success") {
      return {
        checkoutUrl: response.data.data.link,
        reference,
        transactionId: undefined, // Flutterwave generates id later or we use tx_ref
      };
    } else {
      throw new Error(response.data.message || "Flutterwave initialization failed");
    }
  } catch (error: any) {
    console.error("Flutterwave Init Error:", error.response?.data || error.message);
    throw new Error("Failed to initialize Flutterwave payment");
  }
};

export const initializePaystackPayment = async (
  data: PaymentInitiation,
  reference: string
): Promise<PaymentResponse> => {
  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: data.email,
        amount: data.amount * 100, // Paystack expects kobo
        currency: data.currency || "NGN",
        reference: reference,
        callback_url: data.callbackUrl,
        metadata: data.metadata,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status) {
      return {
        checkoutUrl: response.data.data.authorization_url,
        reference: response.data.data.reference,
        transactionId: response.data.data.access_code,
      };
    } else {
      throw new Error(response.data.message || "Paystack initialization failed");
    }
  } catch (error: any) {
    console.error("Paystack Init Error:", error.response?.data || error.message);
    throw new Error("Failed to initialize Paystack payment");
  }
};
