import Image from 'next/image';
import { Button } from '../components/ui/button';

export default function Home() {
  return (
    <div>
      <h1>Hello World</h1>
      <Button>Click me</Button>
      <Button variant='secondary'>secondary</Button>
      <Button variant='destructive'>destructive</Button>
      <Button variant='outline'>outline</Button>
      <Button variant='ghost'>ghost</Button>
      <Button variant='link'>link</Button>
      <p className='text-red-500'>hello world</p>
      <p className='text-blue-500'>hello world</p>
      <p className='text-green-500'>hello world</p>
      <p className='text-yellow-500'>hello world</p>
      <p className='text-purple-500'>hello world</p>
      <p className='text-pink-500'>hello world</p>
      <p>let me know let me know yeah </p>
    </div>
  );
}
