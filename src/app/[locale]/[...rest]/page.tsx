import ErrorPage from '@/components/ErrorPage';

export default function NotFound() {
  return (
    <ErrorPage imageName='404.svg' title='Page not found' showBackButton />
  );
}
