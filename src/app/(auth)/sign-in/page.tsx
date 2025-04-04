import React from 'react';
import { SignInCard } from '@/features/auth/components/sign-in-card';
import { getCurrent } from '@/features/auth/queries';
import { redirect } from 'next/navigation';
type Props = {};

const SignInPage = async (props: Props) => {
  const user = await getCurrent();
  if (user) redirect('/');
  return <SignInCard />;
};

export default SignInPage;
