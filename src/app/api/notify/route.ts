export async function POST() {
  return Response.json(
    { error: "Layanan notifikasi belum tersedia." },
    { status: 501 },
  );
}
