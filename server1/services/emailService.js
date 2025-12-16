import mailer from '../config/mailer.js';
import dotenv from 'dotenv';

dotenv.config();

export const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendResetEmail = async (toEmail, otp) => {
    const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER;
    
    const html = `
<!DOCTYPE html>
<html>
    <body style="margin:0;padding:0;background:#f5f3ff;font-family:'Segoe UI',Arial,sans-serif;color:#1f2937;">
        <table width="100%" cellspacing="0" cellpadding="0" style="padding:24px 0;">
            <tr>
                <td align="center">
                    <table width="520" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:16px;box-shadow:0 12px 30px rgba(79,70,229,0.12);overflow:hidden;">
                        <tr>
                            <td style="background:linear-gradient(135deg,#4f46e5 0%,#4338ca 100%);padding:18px 24px;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:0.3px;">
                                Tadreej Password Reset
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:24px 28px;">
                                <p style="margin:0 0 12px;font-size:16px;font-weight:600;color:#111827;">Hi there,</p>
                                <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#374151;">
                                    We received a request to reset your Tadreej password. Enter the code below in the app to continue:
                                </p>
                                <div style="margin:18px 0; text-align:center;">
                                    <span style="display:inline-block;padding:14px 18px;font-size:22px;letter-spacing:6px;font-weight:700;color:#ffffff;background:#4f46e5;border-radius:12px;">
                                        ${otp}
                                    </span>
                                </div>
                                <p style="margin:0 0 12px;font-size:14px;color:#4b5563;">
                                    This code expires in <strong style="color:#b91c1c;">2 minutes</strong>. Please use it right away or you'll need to request a new one. If you didn't request this, you can ignore this email and your password will stay the same.
                                </p>
                                <p style="margin:18px 0 0;font-size:14px;color:#4b5563;">
                                    Thanks,<br/><strong>The Tadreej Team</strong>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="background:#f3f4f6;padding:12px 24px;text-align:center;font-size:12px;color:#6b7280;">
                                Need help? Reply to this email and we'll assist you.
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
</html>`;

    await mailer.sendMail({
        from: fromEmail,
        to: toEmail,
        subject: 'Reset your Tadreej password',
        html
    });
};
