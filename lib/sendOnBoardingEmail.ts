import { transporter } from "@/lib/mailer"

export async function sendOnboardingEmail(
  toEmail: string,
  userName: string
) {
  try {
    await transporter.sendMail({
    from: `"${process.env.BREVO_SENDER_NAME}" <${process.env.BREVO_SENDER_EMAIL}>`,
    to: toEmail,
    subject: "Welcome to FrameFlow ",
    html: `
  <div style="background-color:#f5f7fa; padding:40px 0;">
    <div style="
      max-width:600px;
      margin:0 auto;
      background-color:#ffffff;
      border-radius:8px;
      padding:32px;
      font-family: Arial, Helvetica, sans-serif;
      color:#333333;
    ">

      <!-- Header -->
      <h1 style="
        margin:0 0 16px 0;
        font-size:24px;
        font-weight:600;
        color:#111827;
      ">
        Welcome ${userName}
      </h1>

      <!-- Greeting -->
      <p style="font-size:15px; line-height:1.6; margin:0 0 16px 0;">
        Welcome to FrameFlow,
      </p>

      <!-- Body -->
      <p style="font-size:15px; line-height:1.6; margin:0 0 16px 0;">
        Your account has been successfully created. We’re excited to have you onboard.
      </p>

      <p style="font-size:15px; line-height:1.6; margin:0 0 16px 0;">
        FrameFlow helps you build, transform your frames faster — all in one place.
      </p>

      <!-- CTA text (no button yet, keeps it simple) -->
      <p style="font-size:15px; line-height:1.6; margin:0 0 24px 0;">
        You can now log in and start exploring the platform.
      </p>

      <!-- Footer -->
      <hr style="border:none; border-top:1px solid #e5e7eb; margin:24px 0;" />

      <p style="font-size:13px; color:#6b7280; margin:16px 0 0 0;">
        Regards,<br/>
        <strong><a href='https://frame-flow-transform.vercel.app/'>Team FrameFlow</a></strong>
      </p>

    </div>
  </div>
`,

  });
  } catch (error) {
    console.log("Onborading Email Sending failed: ", error);
  }
}
