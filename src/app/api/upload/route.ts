import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file)
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public/uploads");

  await mkdir(uploadDir, { recursive: true });

  const uploadPath = path.join(uploadDir, file.name);
  await writeFile(uploadPath, buffer);

  const url = `/uploads/${file.name}`;

  return NextResponse.json({ success: true, url });
};
