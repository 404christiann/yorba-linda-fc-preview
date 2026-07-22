const FLAG_BUCKET_URL = "https://ydvggllbrswfchgjhjhr.supabase.co/storage/v1/object/public/flags";

// Nationality values used by roster records mapped to their exact bucket files.
const FLAG_FILES: Record<string, string> = {
  American: "USA.png",
  Mexican: "Mexico.png",
  Bulgarian: "Bulgaria.png",
  Albanian: "Albania.png",
  Brazilian: "Brazil.png",
  French: "France.png",
};

export function getFlagUrl(nationality: string): string | undefined {
  const filename = FLAG_FILES[nationality.trim()];
  return filename ? `${FLAG_BUCKET_URL}/${encodeURIComponent(filename)}` : undefined;
}
