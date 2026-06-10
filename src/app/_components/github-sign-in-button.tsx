'use client';

import { IconBrandGithub } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';

export function GitHubSignInButton({
  size = 'default',
  variant = 'default',
  className,
  children = 'Sign in with GitHub',
  iconSize = 16,
}: GitHubSignInButtonProps) {
  return (
    <Button
      size={size}
      variant={variant}
      className={className}
      onClick={() => {
        window.location.href = '/api/auth/github';
      }}
    >
      <IconBrandGithub size={iconSize} />
      {children}
    </Button>
  );
}
