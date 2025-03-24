import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

type Props = {};

export const Sidebar = (props: Props) => {
  return (
    <aside className='h-full bg-neutral-100 p-4 w-full'>
      <Link href='/'>
        <Image src='/logo.svg' alt=' ' />
      </Link>
    </aside>
  );
};
