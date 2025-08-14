export function getBaseUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  return (fromEnv && /^https?:\/\//.test(fromEnv)) ? fromEnv : "https://rsvp-next.vercel.app";
}
