import { options as authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth/next';

export const apiClient = async (
  path: string,
  options: RequestInit = {},
  revalidateOptions?: { revalidate?: number; tags?: string[] }
) => {
  const session = await getServerSession(authOptions);
  const token = session?.user?.accessToken;
  // Headers with token, if available
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    headers,
    next: revalidateOptions,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}: ${res.statusText}`);
  }

  return res.json();
};
