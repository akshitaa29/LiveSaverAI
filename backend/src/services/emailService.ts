import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({
  to,
  subject,
  html,
}: SendEmailParams) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "LiveAISaver <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Resend Error:", error);
      throw new Error("Failed to send email");
    }

    console.log("Email sent successfully:", data?.id);

    return data;
  } catch (error) {
    console.error("Email Service Error:", error);
    throw error;
  }
};