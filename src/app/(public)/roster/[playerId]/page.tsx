import { PlayerProfileScreen } from "@/components/public/PlayerProfileScreen";
export default async function PlayerPage({ params }: { params: Promise<{ playerId: string }> }) { const { playerId } = await params; return <PlayerProfileScreen playerId={playerId} />; }
