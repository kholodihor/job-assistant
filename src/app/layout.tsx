import { Open_Sans } from "next/font/google";
import "./globals.css";

type LayoutProps = {
  children: React.ReactNode;
};
const openSans = Open_Sans({
  subsets: ["latin", "cyrillic"],
  variable: "--font-open-sans",
});

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html>
      <body className={`${openSans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
