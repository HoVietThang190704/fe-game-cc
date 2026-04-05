import { FooterSection } from "./(intro)/FooterSection"

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {children}
      <FooterSection />
    </>
  )
}