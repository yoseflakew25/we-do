import SignupForm from '@/features/signup/components/SignupForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HOOPOE - Signup',
};

export default function SignupPage() {
  return <SignupForm />;
}
