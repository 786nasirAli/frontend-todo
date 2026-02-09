import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agentic Todo App",
  description: "Secure multi-user todo application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Hide Next.js Error Overlay for MetaMask issues */
            nextjs-portal {
              display: none !important;
            }
            #nextjs-dev-overlay {
              display: none !important;
            }
          `
        }} />
        <script dangerouslySetInnerHTML={{
          __html: `
            // Block MetaMask errors from bubbling up
            window.addEventListener('error', (event) => {
              if (event.message && (event.message.includes('MetaMask') || event.filename.includes('extension'))) {
                event.stopImmediatePropagation();
                event.preventDefault();
              }
            }, true);
            window.addEventListener('unhandledrejection', (event) => {
              if (event.reason && event.reason.message && event.reason.message.includes('MetaMask')) {
                event.stopImmediatePropagation();
                event.preventDefault();
              }
            }, true);
          `
        }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
