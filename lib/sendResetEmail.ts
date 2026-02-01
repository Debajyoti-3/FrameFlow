import { transporter } from "@/lib/mailer"

export async function sendResetEmail(
  toEmail: string,
  resetLink: string
) {
  try {
    await transporter.sendMail({
    from: `"${process.env.BREVO_SENDER_NAME}" <${process.env.BREVO_SENDER_EMAIL}>`,
    to: toEmail,
    subject: "Reset Your Password",
    html: `
  <div style="background-color:#f5f7fa; padding:40px 0; font-family: 'Inter', Arial, sans-serif;">
    <div style="
      max-width:500px;
      margin:0 auto;
      background-color:#ffffff;
      border-radius:12px;
      padding:40px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      color:#333333;
    ">

      <!-- Header -->
      <h1 style="
        margin:0 0 24px 0;
        font-size:24px;
        font-weight:700;
        color:#111827;
        text-align: center;
      ">
        Reset Your Password
      </h1>

      <!-- Body -->
      <p style="font-size:16px; line-height:1.6; margin:0 0 24px 0; color: #4b5563;">
        We received a request to reset the password for your FrameFlow account. If you didn't make this request, verify that current email is secure and ignore this email.
      </p>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetLink}" style="
          background-color: #000000;
          color: #ffffff;
          padding: 14px 32px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
          display: inline-block;
          transition: background-color 0.2s;
        ">
          Reset Password
        </a>
      </div>

      <p style="font-size:14px; line-height:1.6; margin:0 0 8px 0; color: #6b7280; text-align: center;">
        or copy and paste this link into your browser:
      </p>
      
      <p style="margin: 0 0 24px 0; text-align: center;">
        <a href="${resetLink}" style="font-size:14px; color:#2563eb; text-decoration: underline; word-break: break-all;">
          ${resetLink}
        </a>
      </p>

      <p style="font-size:14px; line-height:1.6; margin:0; color: #6b7280;">
        This link will expire in 10 minutes.
      </p>

      <!-- Footer -->
      <hr style="border:none; border-top:1px solid #e5e7eb; margin:32px 0;" />

      <p style="font-size:13px; color:#9ca3af; margin:0; text-align: center;">
        &copy; ${new Date().getFullYear()} FrameFlow. All rights reserved.
      </p>

    </div>
  </div>
`,

  });
  console.log("Password reset email sent to " + toEmail);
  } catch (error) {
    console.log("Password Reset mail send failed: ", error);
  }
}
