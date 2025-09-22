import LoginForm from '@/features/login/components/LoginForm';
import type { Metadata } from 'next';
import { getProviders, getSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'HOOPOE - Login',
};

export default async function LoginPage() {
  const providers = await getProviders();
  const session = await getSession();
  if (session) {
    return redirect('/');
  }
  return <LoginForm providers={providers} />;
}
