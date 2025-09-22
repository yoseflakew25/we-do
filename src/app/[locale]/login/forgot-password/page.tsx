import ForgotPassword from '@/features/login/components/ForgotPassword';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HOOPOE - Forgot Password',
};

export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}
