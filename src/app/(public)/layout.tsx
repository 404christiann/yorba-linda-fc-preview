import { DisclosureBanner } from "@/components/layout/DisclosureBanner";
import { PublicMotion } from "@/components/layout/PublicMotion";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <><DisclosureBanner /><SiteHeader /><PublicMotion /><main className="public-main">{children}</main><SiteFooter /></>;
}
