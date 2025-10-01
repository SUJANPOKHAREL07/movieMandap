import prisma from '../prisma/client';
import { sendMail } from '../userVerifyOTP/nodeMailer';

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
      'Password Reset OTP',
      ` <title>Password Reset OTP</title>
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
            font-family: Arial, Helvetica, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
            color: #333333;
        }
        .email-container {
            width: 100%;
            background-color: #f5f5f5;
        }
        .email-content {
            background-color: #ffffff;
            margin: 20px auto;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        .logo {
            text-align: center;
            padding: 20px 0;
        }
        .otp-code {
            font-size: 32px;
            font-weight: bold;
            text-align: center;
            letter-spacing: 8px;
            padding: 20px;
            margin: 20px 0;
            background-color: #f8f9fa;
            border-radius: 6px;
            color: #1a1a1a;
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
                            <h1>VutunTung</h1>
                        </td>
                    </tr>
                    
                    <!-- Email Content -->
                    <tr>
                        <td class="email-content">
                            <h2>Your One-Time Password (OTP)</h2>
                           <p>Hello ${email}</p>
                      
                            <p>You requested a one-time password to reset your account password. Use the following code to complete your verification:</p>
                            
                            <!-- OTP Code Display -->
                            <div class="otp-code">${otp}</div>
                            
                            <p>This code will expire in <strong>10 minutes</strong>. For security reasons, please do not share this code with anyone.</p>
                            
                            <p>If you didn't request this code, please ignore this email or contact support if you have concerns.</p>
                            
                            
                        </td>
                    </tr>
                    
                    <!-- Support Section -->
                    <tr>
                        <td class="support">
                            <p>Need help? Contact our support team at <a href="mailto:support@vutungtung.com">support@vutungtun.com</a></p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td class="footer">
                            <p>© 2023 VutungTung All rights reserved.</p>
                            <p>123 Business Street, City, State 12345</p>
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
        `
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
    console.log('Otp in  the verification', otp);

    const user = await prisma.user.findUnique({
      where: { email: session.resetEmail },
    });
    console.log('user to verify the otp', user);
    console.log('user to verify the otp', user?.resetOtp);
    console.log('user to verify the otp', typeof user?.resetOtp);
    if (!user || !user.resetOtp || !user.resetOtpExpired)
      throw new Error('Invalid request');

    if (user.resetOtp !== otp) throw new Error('Invalid OTP');
    if (Date.now() > Number(user.resetOtpExpired))
      throw new Error('OTP expired');

    session.otpVerified = true;
    return { message: 'OTP verified successfully', success: true };
  },
};
