'use client';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeftIcon, ImageIcon } from 'lucide-react';
import { updateWorkspaceSchema } from '../schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUpdateWorkspace } from '../api/use-update-workspace';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { DottedSeperator } from '@/components/dotted-seperator';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { cn } from '../../../lib/utils';
import { Workspace } from '../types';
interface EditWorkspaceFormProps {
  onCancel?: () => void;
  initialValues: Workspace;
}

export const EditWorkspaceForm = ({
  onCancel,
  initialValues,
}: EditWorkspaceFormProps) => {
  const { mutate, isPending } = useUpdateWorkspace();
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? '',
    },
  });

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : '',
    };
    mutate(
      { form: finalValues, param: { workspaceId: initialValues.$id } },
      {
        onSuccess: ({ data }) => {
          form.reset();
          //after the workspace is created, redirect to the workspace immediately
          router.push(`/workspaces/${data.$id}`);
        },
      }
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('image', file);
    }
  };

  return (
    <Card className='w-full h-full border-none shadow-none'>
      <CardHeader className='flex flex-row items-center gap-x-4 p-7 space-y-0'>
        <Button
          size='sm'
          variant='secondary'
          onClick={
            onCancel
              ? onCancel
              : () => router.push(`/workspaces/${initialValues.$id}`)
          }
        >
          <ArrowLeftIcon className='size-4 mr-2' />
          Back
        </Button>
        <CardTitle className='text-xl font-bold'>
          {initialValues.name}
        </CardTitle>
      </CardHeader>
      <div className='px-7'>
        <DottedSeperator />
      </div>
      <CardContent className='p-7'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='flex flex-col gap-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Enter workspace name' />
                      </FormControl>
                      <FormMessage />
                    </FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='image'
                render={({ field }) => (
                  <div className='flex flex-col gap-y-2'>
                    <div className='flex items-center gap-x-5'>
                      {field.value ? (
                        <div className='size-[72px] relative rounded-md overflow-hidden'>
                          <Image
                            src={
                              field.value instanceof File
                                ? URL.createObjectURL(field.value)
                                : field.value
                            }
                            alt='Logo'
                            fill
                            className='object-cover'
                          />
                        </div>
                      ) : (
                        <Avatar className='size-[72px]'>
                          <AvatarFallback>
                            <ImageIcon className='size-[36px] text-neutral-400' />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className='flex flex-col'>
                        <p className='text-sm'>Workspace Icon</p>
                        <p className='text-sm text-muted-foreground'>
                          JPG, PNG, SVG, or JPEG, max 1mb
                        </p>
                        <input
                          className='hidden'
                          accept='.jpg, .png, .jpeg, .svg'
                          type='file'
                          ref={inputRef}
                          onChange={handleImageChange}
                          disabled={isPending}
                        />
                        {field.value ? (
                          <Button
                            type='button'
                            disabled={isPending}
                            variant='destructive'
                            size='xs'
                            className='w-fit mt-2'
                            //trigger the hidden input field above
                            onClick={() => {
                              //remove the image from the form state
                              field.onChange(null);
                              //actually remove the image from the input field
                              if (inputRef.current) {
                                inputRef.current.value = '';
                              }
                            }}
                          >
                            Remove image
                          </Button>
                        ) : (
                          <Button
                            type='button'
                            disabled={isPending}
                            variant='tertiary'
                            size='xs'
                            className='w-fit mt-2'
                            //trigger the hidden input field above
                            onClick={() => inputRef.current?.click()}
                          >
                            Upload Image
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
            <DottedSeperator className='py-7' />
            <div className='flex items-center justify-between'>
              {/* give type button because otherwise it will submit the form by default */}
              <Button
                type='button'
                size='lg'
                variant='secondary'
                onClick={onCancel}
                disabled={isPending}
                className={cn(!onCancel && 'invisible')}
              >
                Cancel
              </Button>
              <Button
                // type='submit' <-- default submit so its unnecessary to specify
                size='lg'
                disabled={isPending}
              >
                Save changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
