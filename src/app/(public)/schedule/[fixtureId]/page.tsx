import { prospect } from "@/config/prospect";
import { MatchAreaScreen } from "@/components/public/MatchAreaScreen";

export function generateStaticParams() {
  return prospect.fixtures.map((fixture) => ({ fixtureId: fixture.id }));
}

export default async function MatchAreaPage({ params }: { params: Promise<{ fixtureId: string }> }) {
  const { fixtureId } = await params;
  return <MatchAreaScreen fixtureId={fixtureId} />;
}
