export function DisclosureBanner({ admin = false }: { admin?: boolean }) {
  return <div className="disclosure" role="note"><span className="disclosure-dot" />{admin ? "Admin preview — changes are sample-only and reset on refresh." : <>Interactive concept preview — sample content{" "}only.</>}</div>;
}
