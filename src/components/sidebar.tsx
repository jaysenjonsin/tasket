import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { DottedSeparator } from './dotted-separator';
import { Navigation } from './navigation';
import { WorkspaceSwitcher } from './workspace-switcher';
import { Projects } from './projects';
type Props = {};

export const Sidebar = (props: Props) => {
  return (
    <aside className='h-full bg-neutral-100 p-4 w-full'>
      <Link href='/'>
        <Image src='/logo.svg' width={164} height={48} alt='logo' />
      </Link>
      <DottedSeparator className='my-4' />
      <WorkspaceSwitcher />
      <DottedSeparator className='my-4' />
      <Navigation />
      <DottedSeparator className='my-4' />
      <Projects />
    </aside>
  );
};
