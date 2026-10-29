import { getMediaFile } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const file = await getMediaFile(id);
  if (!file) return new Response("Not found", { status: 404 });
  return new Response(Buffer.from(file.bytes), {
    headers: {
      "Content-Type": file.mime,
      "Cache-Control": "public, max-age=60",
    },
  });
}
