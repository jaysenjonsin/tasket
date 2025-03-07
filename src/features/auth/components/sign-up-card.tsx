import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DottedSeperator } from '@/components/dotted-seperator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
export const SignInCard = () => {
  return (
    <Card className='w-full h-full md:w-[487px] border-none shadow-none'>
      <CardHeader className='flex items-center justify-center text-center p-7'>
        <CardTitle className='text-2xl'>Welcome back!</CardTitle>
      </CardHeader>
      <div className='px-7'>
        <DottedSeperator />
      </div>
      <CardContent className='p-7'>
        <form className='space-y-4'>
          <Input
            required
            type='email'
            value=''
            onChange={() => {}}
            disabled={false}
            placeholder='Enter your email'
          />
          <Input
            required
            type='password'
            value=''
            onChange={() => {}}
            disabled={false}
            placeholder='Enter password'
            min={8}
            max={256}
          />
          <Button disabled={false} size='lg' className='w-full'>
            Log in
          </Button>
        </form>
      </CardContent>
      <div className='px-7'>
        <DottedSeperator />
      </div>
      <CardContent className='p-7 flex flex-col gap-y-4'>
        <Button
          variant='secondary'
          size='lg'
          disabled={false}
          className='w-full'
        >
          <FcGoogle className='size-5 mr-2' />
          Login with google
        </Button>
        <Button
          variant='secondary'
          size='lg'
          disabled={false}
          className='w-full'
        >
          <FaGithub className='size-5 mr-2' />
          Login with Github
        </Button>
      </CardContent>
    </Card>
  );
};
