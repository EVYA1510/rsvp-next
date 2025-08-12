// Accessibility utilities for better keyboard navigation and screen reader support

// Focus management
export const focusFirstElement = (container: HTMLElement) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (focusableElements.length > 0) {
    (focusableElements[0] as HTMLElement).focus();
  }
};

export const trapFocus = (container: HTMLElement) => {
  const focusableElements = Array.from(
    container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ) as HTMLElement[];

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  container.addEventListener('keydown', handleKeyDown);
  
  // Return cleanup function
  return () => container.removeEventListener('keydown', handleKeyDown);
};

// ARIA helpers
export const getAriaLabel = (text: string, context?: string) => {
  return context ? `${text} ${context}` : text;
};

export const getAriaDescribedBy = (description: string) => {
  return description ? `aria-describedby="${description}"` : '';
};

// Screen reader announcements
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Keyboard shortcuts
export const handleKeyboardShortcuts = (e: KeyboardEvent, shortcuts: Record<string, () => void>) => {
  const key = e.key.toLowerCase();
  const ctrl = e.ctrlKey || e.metaKey;
  const shift = e.shiftKey;
  const alt = e.altKey;

  const shortcutKey = [
    ctrl && 'ctrl',
    shift && 'shift',
    alt && 'alt',
    key
  ].filter(Boolean).join('+');

  if (shortcuts[shortcutKey]) {
    e.preventDefault();
    shortcuts[shortcutKey]();
  }
};

// Form accessibility
export const getFormFieldAriaProps = (
  id: string,
  label: string,
  required?: boolean,
  error?: string,
  description?: string
) => {
  const props: Record<string, string> = {
    id,
    'aria-label': label,
  };

  if (required) {
    props['aria-required'] = 'true';
  }

  if (error) {
    props['aria-invalid'] = 'true';
    props['aria-errormessage'] = `${id}-error`;
  }

  if (description) {
    props['aria-describedby'] = `${id}-description`;
  }

  return props;
};

// Button accessibility
export const getButtonAriaProps = (
  label: string,
  pressed?: boolean,
  expanded?: boolean,
  controls?: string
) => {
  const props: Record<string, string> = {
    'aria-label': label,
  };

  if (pressed !== undefined) {
    props['aria-pressed'] = pressed.toString();
  }

  if (expanded !== undefined) {
    props['aria-expanded'] = expanded.toString();
  }

  if (controls) {
    props['aria-controls'] = controls;
  }

  return props;
};

// Navigation accessibility
export const getNavigationAriaProps = (current?: boolean) => {
  const props: Record<string, string> = {};

  if (current) {
    props['aria-current'] = 'page';
  }

  return props;
};
