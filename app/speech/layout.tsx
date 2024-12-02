import { MainNav } from "@/components/main-nav";

export default function SpeechLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MainNav />
      {children}
    </>
  );
}