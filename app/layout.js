import { Poppins } from "next/font/google";
import "./globals.css";


const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['100','200','300','400','500','600','700','800','900'],
  variable: '--poppins',
 });

export const metadata = {
  title: "Taap Maan - A weather app",
  description: "Taap Maan is a weather web application able to show you weather of different regions by simply searching name of the city.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.variable}>{children}</body>
    </html>
  );
}
