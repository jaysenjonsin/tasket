'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DottedSeperator } from '@/components/dotted-seperator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import Link from 'next/link';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { registerSchema } from '../../schemas';
import { useRegister } from '../api/use-register';
export const SignUpCard = () => {
  const { mutate, isPending } = useRegister();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    mutate({ json: values });
  };
  return (
    <Card className='w-full h-full md:w-[487px] border-none shadow-none'>
      <CardHeader className='flex items-center justify-center text-center p-7'>
        <CardTitle className='text-2xl'>Sign up</CardTitle>
        <CardDescription>
          By signing up, you agree to our{' '}
          <Link href='/privacy'>
            <span className='text-blue-700'>Privacy Policy </span>
          </Link>{' '}
          and{' '}
          <Link href='/terms'>
            <span className='text-blue-700'>Terms of Service</span>
          </Link>
        </CardDescription>
      </CardHeader>
      <div className='px-7'>
        <DottedSeperator />
      </div>
      <CardContent className='p-7'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              name='name'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder='Enter your name'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='email'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder='Enter your email'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name='password'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='Enter your password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isPending} size='lg' className='w-full'>
              Sign up
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className='px-7'>
        <DottedSeperator />
      </div>
      <CardContent className='p-7 flex flex-col gap-y-4'>
        <Button
          variant='secondary'
          size='lg'
          disabled={isPending}
          className='w-full'
        >
          <FcGoogle className='size-5 mr-2' />
          Login with google
        </Button>
        <Button
          variant='secondary'
          size='lg'
          disabled={isPending}
          className='w-full'
        >
          <FaGithub className='size-5 mr-2' />
          Login with Github
        </Button>
      </CardContent>
      <div className='px-7'>
        <DottedSeperator />
      </div>
      <CardContent className='p-7 flex items-center justify-center'>
        <p>Already have an account?</p>
        <Link href='/sign-in'>
          <span className='text-blue-500'> &nbsp; Sign In</span>
        </Link>
      </CardContent>
    </Card>
  );
};
