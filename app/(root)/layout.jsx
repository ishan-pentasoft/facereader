import Dock from "@/components/user/Dock";

export default function RootLayout({ children }) {
  return (
    <main className="w-full">
      <Dock />
      {children}
    </main>
  );
}
