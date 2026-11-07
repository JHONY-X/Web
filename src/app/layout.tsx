import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Rohobot | Healthcare Careers",
    template: "%s | Rohobot",
  },
  description:
    "Connect with verified healthcare professionals, trusted healthcare employers, and career development opportunities across Ethiopia.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased font-sans"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
