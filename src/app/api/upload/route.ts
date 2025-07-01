import { writeFile, unlink } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const previousImage = formData.get("previousImage") as string | null;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public/uploads");

  const filename = `${file.name}`;
  const uploadPath = path.join(uploadDir, filename);

  if (previousImage) {
    const oldPath = path.join(uploadDir, path.basename(previousImage));
    
    try {
      await unlink(oldPath);
    } catch (err) {
      console.warn("Failed to delete old image:", err);
    }
  }

  await writeFile(uploadPath, buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
