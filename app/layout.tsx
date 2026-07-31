import "./globals.css";

export const metadata = {
  title: {
    default: "Gifted Delites — Spreading Joy and Goodwill",
    template: "%s | Gifted Delites",
  },
  description:
    "Premium corporate gifts, personalised keepsakes and custom branded products created to make every occasion memorable.",
  icons: {
    icon: "/images/gifted-delites-logo.jpg",
    apple: "/images/gifted-delites-logo.jpg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,500;1,400&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
