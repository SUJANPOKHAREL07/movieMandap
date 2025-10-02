import prisma from '../prisma/client';
import { sendMail } from '../userVerifyOTP/nodeMailer';
import { hashPassword } from '../utils/passwordHashing';

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const resetPasswordService = {
  async sendOtp(email: string, session: any) {
    console.log('email in the send opt--', email);
    // console.log('session in the send otp--', session);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('User not found');

    const otp = generateOtp();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes (timestamp in ms)

    await prisma.user.update({
      where: { email },
      data: { resetOtp: otp, resetOtpExpired: expiry },
    });

    // Save email in session
    session.resetEmail = email;
    session.otpVerified = false;

    await sendMail(
      email,
      'Reset Password OTP',
      `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset OTP - Cinegudi</title>
    <style>
        /* Reset CSS for email compatibility */
        body, table, td, a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            border-collapse: collapse;
        }
        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
        }
        
        /* Main styles */
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
            color: #333333;
        }
        .email-container {
            width: 100%;
            background-color: #f8f9fa;
        }
        .email-content {
            background-color: #ffffff;
            margin: 20px auto;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        .logo {
            text-align: center;
            padding: 20px 0;
        }
        .logo h1 {
            color: #6a11cb;
            margin: 0;
            font-size: 32px;
            font-weight: 700;
            background: linear-gradient(45deg, #6a11cb 0%, #2575fc 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .header-icon {
            text-align: center;
            margin-bottom: 20px;
        }
        .header-icon div {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 32px;
        }
        .otp-code {
            font-size: 42px;
            font-weight: bold;
            text-align: center;
            letter-spacing: 10px;
            padding: 25px;
            margin: 25px 0;
            background: linear-gradient(to right, #f8f9fa, #e9ecef);
            border-radius: 10px;
            color: #1a1a1a;
            border: 1px dashed #6a11cb;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #666666;
            padding: 20px;
        }
        .support {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eeeeee;
        }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background: linear-gradient(45deg, #6a11cb, #2575fc);
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 15px 0;
        }
        .security-note {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 12px 16px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .expiry-notice {
            background-color: #e7f3ff;
            border-left: 4px solid #0d6efd;
            padding: 12px 16px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .social-links {
            text-align: center;
            margin: 20px 0;
        }
        .social-links a {
            display: inline-block;
            margin: 0 8px;
            color: #6a11cb;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" class="email-container">
        <tr>
            <td align="center">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="container">
                    <!-- Logo Section -->
                    <tr>
                        <td class="logo">
                            <h1>Cinegudi</h1>
                        </td>
                    </tr>
                    
                    <!-- Email Content -->
                    <tr>
                        <td class="email-content">
                            <!-- Header Icon -->
                            <div class="header-icon">
                                <div>🔒</div>
                            </div>
                            
                            <h2 style="text-align: center; color: #333; margin-bottom: 5px;">Password Reset Request</h2>
                            <p style="text-align: center; color: #666; margin-top: 0;">Hello ${email}</p>
                      
                            <p>We received a request to reset your Cinegudi account password. Use the One-Time Password (OTP) below to verify your identity and create a new password.</p>
                            
                            <!-- OTP Code Display -->
                            <div class="otp-code">${otp}</div>
                            
                            <div class="expiry-notice">
                                <p><strong>This code will expire in 10 minutes.</strong> If you don't use it before then, you'll need to request a new OTP.</p>
                            </div>
                            
                            <div class="security-note">
                                <p><strong>Security Tip:</strong> Never share your OTP with anyone. Cinegudi will never ask for your password or OTP via email, phone, or text message.</p>
                            </div>
                            
                            <p style="text-align: center;">
                                <a href="#" class="btn">Reset Password</a>
                            </p>
                            
                            <p>If you didn't request this password reset, please ignore this email or contact our support team immediately if you're concerned about your account's security.</p>
                            
                            <!-- Social Links -->
                            <div class="social-links">
                                <a href="#">Website</a> • 
                                <a href="#">Facebook</a> • 
                                <a href="#">Twitter</a> • 
                                <a href="#">Instagram</a>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Support Section -->
                    <tr>
                        <td class="support">
                            <p>Need help? Contact our support team at <a href="mailto:support@cinegudi.com">support@cinegudi.com</a> or visit our Help Center.</p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td class="footer">
                            <p>© 2023 Cinegudi. All rights reserved.</p>
                            <p>123 Entertainment Avenue, Film City, FC 12345</p>
                            <p>
                                <a href="#">Unsubscribe</a> | 
                                <a href="#">Privacy Policy</a> | 
                                <a href="#">Terms of Service</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
    );
    return { message: 'OTP sent successfully', success: true };
  },
  async resendOtp(session: any) {
    if (!session.resetEmail) throw new Error('No email in session');
    const send = this.sendOtp(session.resetEmail, session);
    return send;
  },

  async verifyOtp(otp: string, session: any) {
    if (!session.resetEmail) throw new Error('Session expired');

    const user = await prisma.user.findUnique({
      where: { email: session.resetEmail },
    });
    if (!user || !user.resetOtp || !user.resetOtpExpired)
      throw new Error('Invalid request');

    if (user.resetOtp !== otp) throw new Error('Invalid OTP');
    if (Date.now() > Number(user.resetOtpExpired))
      throw new Error('OTP expired');

    session.otpVerified = true;
    return { message: 'OTP verified successfully', success: true };
  },

  async resetPassword(newPassword: string, session: any) {
    if (!session.resetEmail) throw new Error('Session expired');
    if (!session.otpVerified) throw new Error('OTP not verified');

    const hashed = await hashPassword(newPassword);

    await prisma.user.update({
      where: { email: session.resetEmail },
      data: {
        password: hashed,
        resetOtp: '',
        resetOtpExpired: null,
      },
    });

    // clear session
    session.resetEmail = null;
    session.otpVerified = false;

    return { message: 'Password reset successfully', success: true };
  },
};
