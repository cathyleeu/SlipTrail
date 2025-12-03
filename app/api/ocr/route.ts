import { NextRequest, NextResponse } from "next/server"
import { spawn } from "child_process"
import { writeFile, unlink } from "fs/promises"
import path from "path"

export async function POST(request: NextRequest) {
  const form = await request.formData()
  const file = form.get("file") as File

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const tempImagePath = path.join("/tmp", file.name)
  await writeFile(tempImagePath, buffer)

  const python = spawn("python3", ["./python/ocr.py", tempImagePath], {
    env: {
      ...process.env,
      PATH: `${process.cwd()}/python/venv/bin:${process.env.PATH}`,
    }
  })

  let ocrOutput = ""
  let ocrError = ""

  python.stdout.on("data", (data) => {
    ocrOutput += data.toString()
  })
  python.stderr.on("data", (data) => {
    ocrError += data.toString()
  })

  const exitCode: number = await new Promise((resolve) => {
    python.on("close", resolve)
  })

  await unlink(tempImagePath)

  if (exitCode !== 0) {
    return NextResponse.json({ error: ocrError }, { status: 500 })
  }

  return NextResponse.json({ text: ocrOutput.trim() })
}