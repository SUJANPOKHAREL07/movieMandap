'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_USER, VERIFY_OTP, RESEND_OTP } from '@/lib/mutations';
import { useRouter } from 'next/navigation';

type SignupStep = 'register' | 'verify-otp';

export default function SignupPage() {
    const router = useRouter();
    const [step, setStep] = useState<SignupStep>('register');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [otp, setOtp] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [resendTimer, setResendTimer] = useState(0);

    const [createUser, { loading: creatingUser }] = useMutation(CREATE_USER);
    const [verifyOtp, { loading: verifyingOtp }] = useMutation(VERIFY_OTP);
    const [resendOtp, { loading: resendingOtp }] = useMutation(RESEND_OTP);

    // Validation functions
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string) => {
        return password.length >= 8;
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (!validatePassword(formData.password)) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const { data } = await createUser({
                variables: {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    role: 'user',
                },
            });

            if (data?.createUser?.success) {
                setStep('verify-otp');
                setResendTimer(60);
                const interval = setInterval(() => {
                    setResendTimer((prev) => {
                        if (prev <= 1) {
                            clearInterval(interval);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            } else {
                setErrors({ form: data?.createUser?.message || 'Registration failed' });
            }
        } catch (error: any) {
            setErrors({ form: error.message || 'An error occurred' });
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp.trim()) {
            setErrors({ otp: 'Please enter the OTP' });
            return;
        }

        try {
            const { data } = await verifyOtp({
                variables: { otp },
            });

            if (data?.verifyOtp?.success) {
                // Success! Redirect to login or dashboard
                router.push('/');
            } else {
                setErrors({ otp: data?.verifyOtp?.message || 'Invalid OTP' });
            }
        } catch (error: any) {
            setErrors({ otp: error.message || 'Verification failed' });
        }
    };

    const handleResendOtp = async () => {
        try {
            const { data } = await resendOtp({
                variables: { email: formData.email },
            });

            if (data?.resendOtp?.success) {
                setResendTimer(60);
                setErrors({});
                const interval = setInterval(() => {
                    setResendTimer((prev) => {
                        if (prev <= 1) {
                            clearInterval(interval);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            } else {
                setErrors({ form: data?.resendOtp?.message || 'Failed to resend OTP' });
            }
        } catch (error: any) {
            setErrors({ form: error.message || 'Failed to resend OTP' });
        }
    };

    const getPasswordStrength = (password: string) => {
        if (!password) return { strength: 0, label: '', color: '' };
        if (password.length < 8) return { strength: 1, label: 'Weak', color: 'bg-red-500' };
        if (password.length < 12) return { strength: 2, label: 'Medium', color: 'bg-yellow-500' };
        return { strength: 3, label: 'Strong', color: 'bg-green-500' };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        {step === 'register' ? 'Create Account' : 'Verify Email'}
                    </h1>
                    <p className="text-gray-400">
                        {step === 'register'
                            ? 'Join us to discover amazing movies'
                            : `Enter the OTP sent to ${formData.email}`}
                    </p>
                </div>

                {/* Card */}
                <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800 rounded-2xl p-8 shadow-2xl">
                    {step === 'register' ? (
                        <form onSubmit={handleRegister} className="space-y-6">
                            {/* Username */}
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => {
                                        setFormData({ ...formData, username: e.target.value });
                                        setErrors({ ...errors, username: '' });
                                    }}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    placeholder="Choose a username"
                                />
                                {errors.username && (
                                    <p className="mt-1 text-sm text-red-400">{errors.username}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => {
                                        setFormData({ ...formData, email: e.target.value });
                                        setErrors({ ...errors, email: '' });
                                    }}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    placeholder="your@email.com"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => {
                                        setFormData({ ...formData, password: e.target.value });
                                        setErrors({ ...errors, password: '' });
                                    }}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    placeholder="Create a strong password"
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                                )}
                                {formData.password && (
                                    <div className="mt-2">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${passwordStrength.color} transition-all duration-300`}
                                                    style={{ width: `${(passwordStrength.strength / 3) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-gray-400">{passwordStrength.label}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => {
                                        setFormData({ ...formData, confirmPassword: e.target.value });
                                        setErrors({ ...errors, confirmPassword: '' });
                                    }}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    placeholder="Confirm your password"
                                />
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
                                )}
                            </div>

                            {/* Form Error */}
                            {errors.form && (
                                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                                    <p className="text-sm text-red-400">{errors.form}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={creatingUser}
                                className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg shadow-orange-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {creatingUser ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Creating Account...
                                    </span>
                                ) : (
                                    'Create Account'
                                )}
                            </button>

                            {/* Login Link */}
                            <p className="text-center text-gray-400 text-sm">
                                Already have an account?{' '}
                                <a href="/browse" className="text-orange-500 hover:text-orange-400 font-medium transition-colors">
                                    Sign In
                                </a>
                            </p>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            {/* OTP Input */}
                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-2">
                                    Verification Code
                                </label>
                                <input
                                    id="otp"
                                    type="text"
                                    value={otp}
                                    onChange={(e) => {
                                        setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                                        setErrors({ ...errors, otp: '' });
                                    }}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-center text-2xl tracking-widest placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    placeholder="000000"
                                    maxLength={6}
                                />
                                {errors.otp && (
                                    <p className="mt-1 text-sm text-red-400">{errors.otp}</p>
                                )}
                            </div>

                            {/* Resend OTP */}
                            <div className="text-center">
                                {resendTimer > 0 ? (
                                    <p className="text-sm text-gray-400">
                                        Resend code in <span className="text-orange-500 font-medium">{resendTimer}s</span>
                                    </p>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={resendingOtp}
                                        className="text-sm text-orange-500 hover:text-orange-400 font-medium transition-colors disabled:opacity-50"
                                    >
                                        {resendingOtp ? 'Sending...' : 'Resend Code'}
                                    </button>
                                )}
                            </div>

                            {/* Form Error */}
                            {errors.form && (
                                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                                    <p className="text-sm text-red-400">{errors.form}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={verifyingOtp}
                                className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg shadow-orange-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {verifyingOtp ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Verifying...
                                    </span>
                                ) : (
                                    'Verify & Continue'
                                )}
                            </button>

                            {/* Back Button */}
                            <button
                                type="button"
                                onClick={() => {
                                    setStep('register');
                                    setOtp('');
                                    setErrors({});
                                }}
                                className="w-full py-2 text-gray-400 hover:text-white transition-colors text-sm"
                            >
                                ← Back to Registration
                            </button>
                        </form>
                    )}
                </div>

                {/* Footer */}
                <p className="text-center text-gray-500 text-xs mt-6">
                    By signing up, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
}
