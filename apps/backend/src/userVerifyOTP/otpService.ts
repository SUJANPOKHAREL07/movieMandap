import transporter from './nodeMailer';

export const otpService = {
  generateOtp: () => String(Math.floor(100000 + Math.random() * 900000)),

  sendOtpEmail: async (email: string, otp: string) => {
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Verify your account',
      html: `<h2>Your OTP is: ${otp}</h2><p>Valid for 10 minutes</p>`,
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
