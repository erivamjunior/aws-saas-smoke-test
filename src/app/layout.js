import "@/app/globals.css";

export const metadata = {
  title: "AWS SaaS Smoke Test",
  description: "Fullstack minimal para validar App Runner + RDS + Prisma.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
