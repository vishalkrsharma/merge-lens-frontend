'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { IconBrandGithub, IconGitBranch } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signIn, signUp } from '@/lib/auth-client';
import { type SignUpValues, signUpSchema } from '@/lib/auth-schema';

export default function SignUpPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  async function onSubmit(values: SignUpValues) {
    setServerError(null);
    const { error } = await signUp.email(values);
    if (error) {
      setServerError(error.message ?? null);
      return;
    }
    router.push('/dashboard');
  }

  async function handleGitHub() {
    await signIn.social({
      provider: 'github',
      callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    });
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background px-4'>
      <div className='mb-8 flex items-center gap-2'>
        <IconGitBranch size={24} className='text-primary' />
        <span className='font-mono text-xl font-semibold'>MergeLens</span>
      </div>

      <Card className='w-full max-w-sm'>
        <CardHeader className='text-center'>
          <CardTitle className='text-lg'>Create account</CardTitle>
          <CardDescription>
            Create an account to get started with MergeLens.
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          <Button
            variant='outline'
            className='w-full gap-2'
            onClick={handleGitHub}
          >
            <IconBrandGithub size={16} />
            Continue with GitHub
          </Button>

          <div className='relative flex items-center gap-3'>
            <div className='flex-1 border-t' />
            <span className='text-xs text-muted-foreground'>or</span>
            <div className='flex-1 border-t' />
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex flex-col gap-3'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input placeholder='Jane Smith' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='you@example.com'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='••••••••'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {serverError && (
                <p className='text-xs text-destructive'>{serverError}</p>
              )}
              <Button
                type='submit'
                className='w-full'
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? 'Creating account…'
                  : 'Create account'}
              </Button>
            </form>
          </Form>

          <p className='text-center text-xs text-muted-foreground'>
            Already have an account?{' '}
            <Link href='/auth/signin' className='underline underline-offset-4'>
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>

      <p className='mt-6 text-xs text-muted-foreground'>
        <Link href='/' className='underline-offset-4 hover:underline'>
          Back to home
        </Link>
      </p>
    </div>
  );
}
