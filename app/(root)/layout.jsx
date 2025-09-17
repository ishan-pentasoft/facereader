import Dock from "@/components/user/Dock";
import TopBanner from "@/components/user/TopBanner";

export default function RootLayout({ children }) {
  return (
    <main className="w-full relative">
      <TopBanner />
      <Dock />
      {children}
    </main>
  );
}
