import transporter from './nodeMailer';

export const otpService = {
  generateOtp: () => String(Math.floor(100000 + Math.random() * 900000)),

  sendOtpEmail: async (email: string, otp: string) => {
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Verify your account',
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CineGudi Account Verification</title>
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
        body {
            font-family: Arial, Helvetica, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }
        .email-container {
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            margin: 20px auto;
        }
        .header {
            background: linear-gradient(135deg, #6A11CB 0%, #2575FC 100%);
            padding: 25px 20px;
            text-align: center;
        }
        .logo {
            color: white;
            font-size: 28px;
            font-weight: bold;
            text-decoration: none;
        }
        .logo span {
            display: block;
            font-size: 14px;
            font-weight: normal;
            opacity: 0.8;
            margin-top: 5px;
        }
        .content {
            padding: 30px;
            color: #333333;
            line-height: 1.6;
        }
        .otp-code {
            background-color: #f8f9fa;
            border-left: 4px solid #2575FC;
            padding: 15px;
            margin: 25px 0;
            text-align: center;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #2575FC;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666666;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #2575FC;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            margin: 15px 0;
        }
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #2575FC;
            text-decoration: none;
        }
        .warning {
            background-color: #fff4f4;
            border: 1px solid #ffcdd2;
            padding: 10px;
            border-radius: 4px;
            font-size: 12px;
            margin-top: 20px;
            color: #d32f2f;
        }
        @media only screen and (max-width: 480px) {
            .content {
                padding: 20px;
            }
            .otp-code {
                font-size: 24px;
                letter-spacing: 5px;
            }
        }
    </style>
</head>
<body>
    <center class="container">
        <div class="email-container">
            <!-- Header -->
            <div class="header">
                <a href="#" class="logo">CINEGUDI<span>Your Ultimate Movie Experience</span></a>
            </div>
            
            <!-- Content -->
            <div class="content">
                <h2>Verify Your Account</h2>
                <p>Hello ${email},</p>
                <p>Thank you for creating an account with CineGudi! To complete your registration and start enjoying our services, please use the following One-Time Password (OTP) to verify your account:</p>
                
                <div class="otp-code">${otp}</div>
                
                <p>This verification code will expire in <strong>10 minutes</strong>. For security reasons, please do not share this code with anyone.</p>
                
                
                
                <p>If the button doesn't work, you can copy and paste the code into the verification screen in our app or website.</p>
                
                <div class="warning">
                    <strong>Security Notice:</strong> If you didn't request this code, please ignore this email or contact our support team immediately at <a href="mailto:support@cinegudi.com">support@cinegudi.com</a>.
                </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
                <p>&copy; 2023 Cinegudi. All rights reserved.</p>
                <p>123 Movie Lane, Hollywood, CA 90001</p>
                
                <div class="social-links">
                    <a href="#">Facebook</a> | 
                    <a href="#">Twitter</a> | 
                    <a href="#">Instagram</a>
                </div>
                
                <p>You're receiving this email because you created an account with cinegudi.</p>
                <p><a href="#">Unsubscribe</a> | <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></p>
            </div>
        </div>
    </center>
</body>
</html>`,
    });
  },

  sendOtp: async (email: string, session: any) => {
    const otp = otpService.generateOtp();
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    session.pendingUserData.otp = otp;
    session.pendingUserData.otpExpiry = otpExpiry;

    await new Promise<void>((res, rej) =>
      session.save((err: any) => (err ? rej(err) : res()))
    );

    await otpService.sendOtpEmail(email, otp);
    return { success: true, message: 'OTP sent' };
  },

  resendOtp: async (session: any) => {
    if (!session.pendingUserData)
      return { success: false, message: 'No pending user data' };
    return otpService.sendOtp(session.pendingUserData.email, session);
  },

  verifyOtp: async (otp: string, session: any) => {
    const pendingUser = session.pendingUserData;
    console.log('opt serivce verify otp:', pendingUser);
    if (!pendingUser || !pendingUser.otp)
      return { success: false, message: 'OTP not generated' };
    if (Date.now() > pendingUser.otpExpiry)
      return { success: false, message: 'OTP expired' };

    if (pendingUser.otp !== otp)
      return { success: false, message: 'Invalid OTP' };

    pendingUser.otp = undefined;
    pendingUser.otpExpiry = undefined;
    await new Promise<void>((res, rej) =>
      session.save((err: any) => (err ? rej(err) : res()))
    );

    return { success: true, message: 'OTP verified' };
  },
};
