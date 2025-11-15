'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function IntroductionEditorPage() {
  useEffect(() => {
    // Redirect to dashboard since this is a legacy route
    window.location.href = '/admin/dashboard';
  }, []);

  return null;
}
