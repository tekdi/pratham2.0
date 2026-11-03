import NotFoundContent from './NotFoundContent';

export const metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <NotFoundContent />;
}
