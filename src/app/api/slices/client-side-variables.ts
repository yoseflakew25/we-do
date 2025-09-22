export const dynamic = 'force-dynamic';

export default function getGoogleMapApiKey() {
  return process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
}
