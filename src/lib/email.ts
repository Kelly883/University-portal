
import { Resend } from 'resend';
import { env } from "@/env.mjs";

const resend = new Resend(env.RESEND_API_KEY);

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (data: EmailPayload) => {
  const sender = env.EMAIL_FROM || 'Titan University <onboarding@resend.dev>';
  
  if (!env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not found. Email simulation:");
    console.log(`To: ${data.to}`);
    console.log(`Subject: ${data.subject}`);
    console.log(`Body: ${data.html}`);
    return { id: 'mock-id' };
  }

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: sender,
      to: [data.to],
      subject: data.subject,
      html: data.html,
    });

    if (error) {
      console.error("Resend API Error:", error);
      throw new Error(error.message);
    }

    console.log(`Email sent successfully: ${emailData?.id}`);
    return emailData;
  } catch (error) {
    console.error("Error sending email:", error);
    // In production, you might want to log this to a monitoring service (Sentry, etc.)
    throw error;
  }
};
