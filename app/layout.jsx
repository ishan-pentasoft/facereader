import { Norican, Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const norican = Norican({
  variable: "--font-norican",
  weight: "400",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "Facereader Naresh",
  description: "Horoscope reader",
  keywords: ["Horoscope", "Naresh", "Facereader"],
  author: "Naresh",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${norican.variable} ${roboto.variable} antialiased`}>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
