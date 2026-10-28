import { notFound } from 'next/navigation';

// Tanpa root layout di luar [locale], URL yang tidak dikenal ditangkap di sini agar memakai not-found.tsx milik locale.
export default function CatchAll() {
  notFound();
}
