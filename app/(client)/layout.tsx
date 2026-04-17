import { Topbar } from "@/components/Topbar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="shell">
      <Topbar />
      <div className="anim-fade-up">{children}</div>
    </div>
  );
}
