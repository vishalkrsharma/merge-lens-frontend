export function openGithubPopup(url: string, onClose?: () => void) {
  const width = 1020;
  const height = 720;
  const left = Math.round((window.screen.width - width) / 2);
  const top = Math.round((window.screen.height - height) / 2);

  const popup = window.open(
    url,
    'github-popup',
    `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=yes`,
  );

  if (!popup) {
    // Popup blocked — fall back to new tab
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }

  const interval = setInterval(() => {
    try {
      // When GitHub redirects back to our origin, close the popup automatically
      if (popup.location.origin === window.location.origin) {
        popup.close();
        clearInterval(interval);
        onClose?.();
        return;
      }
    } catch {
      // Cross-origin access throws — still on GitHub's domain, keep waiting
    }

    if (popup.closed) {
      clearInterval(interval);
      onClose?.();
    }
  }, 500);
}
