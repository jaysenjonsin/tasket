'use client'; //so we can use the usePathname hook
import React from 'react';
import Image from 'next/image';
import { Button } from '../../components/ui/button';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const pathName = usePathname();
  const isSignIn = pathName === '/sign-in';
  return (
    <main className='bg-neutral-100 min-h-screen'>
      <div className='mx-auto max-w-screen-2xl p-4'>
        <nav className='flex items-center justify-between'>
          <Image src='/logo.svg' height={56} width={152} alt='logo' />
          <Button asChild variant='secondary'>
            <Link href={isSignIn ? '/sign-up' : '/sign-in'}>
              {isSignIn ? ' Sign Up' : 'Login'}
            </Link>
          </Button>
        </nav>
        <div className='flex flex-col items-center justify-center pt-4 md:pt-14'>
          {/* padding top and center the content */}
          {children}
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
