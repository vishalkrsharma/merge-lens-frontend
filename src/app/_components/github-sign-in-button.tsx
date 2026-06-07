'use client';

import { IconBrandGithub } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { signIn } from '@/lib/auth-client';
import { toast } from 'sonner';

interface GitHubSignInButtonProps {
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
  children?: React.ReactNode;
  iconSize?: number;
}

export function GitHubSignInButton({
  size = 'default',
  variant = 'default',
  className,
  children = 'Sign in with GitHub',
  iconSize = 16,
}: GitHubSignInButtonProps) {
  async function handleSignIn() {
    const { error } = await signIn.social({ provider: 'github', callbackURL: process.env.NEXT_PUBLIC_BASE_URL + '/connect-github' });
    if (error) {
      toast.error(error.message ?? 'GitHub sign-in failed');
    }
  }

  return (
    <Button
      size={size}
      variant={variant}
      className={className}
      onClick={handleSignIn}
    >
      <IconBrandGithub size={iconSize} />
      {children}
    </Button>
  );
}
