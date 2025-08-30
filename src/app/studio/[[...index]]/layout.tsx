export const metadata = {
  title: 'Ilio Sauna Studio',
  description: 'Content Management System',
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}