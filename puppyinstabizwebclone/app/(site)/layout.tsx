import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import WhatsAppBar from "@/components/whatsapp-bar";
import PupPal from "@/components/pup-pal";
import PupCurtain from "@/components/pup-curtain";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SiteHeader />
      <main className="pb-20 md:pb-0">{children}</main>
      <SiteFooter />
      <WhatsAppBar />
      <PupPal />
      <PupCurtain />
    </>
  );
}