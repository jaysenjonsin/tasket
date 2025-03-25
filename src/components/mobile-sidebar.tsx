'use client';
import { Sidebar } from './sidebar';
import { MenuIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
export const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);
  return (
    <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
      {/*modal true causes overflow errors */}
      <SheetTrigger asChild>
        <Button variant='secondary' className='lg:hidden'>
          <MenuIcon className='size-4 text-neutral-500' />
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='p-0'>
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};
