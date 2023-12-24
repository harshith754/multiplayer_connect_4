import "./globals.css";
import { Toaster } from "sonner";

export const metadata = {
  title: "Multiplayer Connect 4",
  description: "Harshith K(c)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Toaster richColors />
      <body>{children}</body>
    </html>
  );
}
