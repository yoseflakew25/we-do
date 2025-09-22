'use client';

import LoadingPage from '@/components/LoadingPage';
import { signOut, useSession } from 'next-auth/react';
import {toast} from 'react-toastify'
import { useRouter } from 'next-nprogress-bar';
import { useEffect } from 'react';


export default function Logout() {
  const { data: session, status } = useSession();
  const { replace } = useRouter();

  useEffect(() => {
    let mounted = true

    const handleLogout = async () => {
    try {
        if (session) {
          await signOut({ redirect: false });
        }   
        if (mounted) {
          replace('/');
        }
      } catch (error) {
        if (mounted) {
          toast.error('Failed to logout. Please try again.');
        }
      }
    };

    handleLogout();
    return () => {
      mounted = false;
    };
  }, [session, replace]);



  if (status == 'authenticated') {
    return <LoadingPage />;
  }

  return undefined;
}
