import { Suspense } from 'react';
import DevLogin from './DevLoginContent';

export default function DevLoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DevLogin />
    </Suspense>
  );
}
