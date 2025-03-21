'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DottedSeperator } from '@/components/dotted-seperator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { loginSchema } from '../../schemas';
import { useLogin } from '../api/use-login';

export const SignInCard = () => {
  const { mutate, isPending } = useLogin();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    mutate({ json: values });
  };

  return (
    <Card className='w-full h-full md:w-[487px] border-none shadow-none'>
      <CardHeader className='flex items-center justify-center text-center p-7'>
        <CardTitle className='text-2xl'>Welcome back!</CardTitle>
      </CardHeader>
      <div className='px-7'>
        <DottedSeperator />
      </div>
      <CardContent className='p-7'>
        <Form {...form}>
          {/*includes form, handleSubmit, control, formState, errors and more - this is the form from useForm hook */}
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              name='email'
              control={form.control} //connects the field to react-hook-forms state management
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    {/* FormControl is NOT about control/state management, its just a UI wrapper to wrap the input field for styling */}
                    <Input
                      type='email'
                      placeholder='Enter your email'
                      {...field} //spread the field includes: value, onChange, onBlur, ref. this is why we use render method (to spread the field) instead of having to wire up all the form state manually
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
                      placeholder='Enter password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isPending} size='lg' className='w-full'>
              Log in
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
        <p>Don't have an account?</p>
        <Link href='/sign-up'>
          <span className='text-blue-700'>&nbsp; Sign Up</span>{' '}
          {/* &nbsp; is a non-breaking space */}
        </Link>
      </CardContent>
    </Card>
  );
};
