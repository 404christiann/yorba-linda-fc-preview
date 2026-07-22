import Image from "next/image";
import { getFlagUrl } from "@/lib/flags";

const FLAG_ASPECT = 432 / 741;

export function NationalityFlag({ nationality, className }: { nationality?: string; className?: string }) {
  const src = nationality ? getFlagUrl(nationality) : undefined;
  if (!src) return null;

  return (
    <Image
      src={src}
      alt={`${nationality} flag`}
      width={28}
      height={Math.round(28 * FLAG_ASPECT)}
      className={`nationality-flag ${className ?? ""}`}
    />
  );
}
