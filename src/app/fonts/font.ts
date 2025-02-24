// app/fonts.ts ou app/fonts.js
import { Playfair_Display } from 'next/font/google';

// Vous pouvez choisir différentes variantes : 400, 700...
export const playfair = Playfair_Display({
    weight: ['400', '700'],
    subsets: ['latin'],
    display: 'swap',
});
