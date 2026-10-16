import "./globals.css";

type LayoutProps = {
  children: React.ReactNode;
};

// <html>/<body> are rendered in [locale]/layout.tsx so `lang` is set on the server
export default function RootLayout({ children }: LayoutProps) {
  return children;
}
