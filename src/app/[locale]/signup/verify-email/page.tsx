import EmailVerification from '@/features/email-verification/components/EmailVerification';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HOOPOE - Verify Email',
};

export default function VerifyEmail() {
  return <EmailVerification />;
}
