import { NextResponse } from 'next/server'
import { join } from 'path'
import { mkdir, rm, writeFile } from 'fs/promises'
import { tmpdir } from 'os'
import { randomBytes } from 'crypto'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
import { requireAdmin } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

ffmpeg.setFfmpegPath(ffmpegInstaller.path)

const ALLOWED_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-matroska'
]

const MAX_SIZE_BYTES = 300 * 1024 * 1024 // 300MB
const OUTPUT_DIR = join(process.cwd(), 'public')
const OUTPUT_MP4 = join(OUTPUT_DIR, 'hero-video.mp4')
const OUTPUT_WEBM = join(OUTPUT_DIR, 'hero-video.webm')

async function saveTempFile(file) {
  const buffer = Buffer.from(await file.arrayBuffer())
  const ext = (file.name?.split('.').pop() || 'mp4').toLowerCase()
  const tempDir = join(tmpdir(), `hero-video-${randomBytes(6).toString('hex')}`)
  await mkdir(tempDir, { recursive: true })
  const tempPath = join(tempDir, `upload.${ext}`)
  await writeFile(tempPath, buffer)
  return { tempDir, tempPath }
}

function transcode(inputPath, outputPath, format) {
  return new Promise((resolve, reject) => {
    const command = ffmpeg(inputPath)
      .outputOptions([
        '-movflags', 'faststart',
        '-preset', 'medium',
        '-crf', format === 'mp4' ? '23' : '30',
        '-vf', "scale='min(1920,iw)':-2"
      ])
      .on('error', reject)
      .on('end', () => resolve(outputPath))

    if (format === 'mp4') {
      command.videoCodec('libx264').audioCodec('aac').audioBitrate('160k')
    } else {
      command
        .videoCodec('libvpx-vp9')
        .audioCodec('libopus')
        .outputOptions(['-b:v', '0', '-deadline', 'good'])
    }

    command.save(outputPath)
  })
}

export async function POST(request) {
  const authResult = await requireAdmin(request)
  if (authResult instanceof NextResponse) {
    return authResult
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: 'No video provided' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported format. Please upload MP4, MOV, WEBM, or MKV.' },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 300MB.' },
        { status: 400 }
      )
    }

    const { tempDir, tempPath } = await saveTempFile(file)

    await mkdir(OUTPUT_DIR, { recursive: true })

    // Transcode to both mp4 and webm for broad browser support
    await transcode(tempPath, OUTPUT_MP4, 'mp4')
    await transcode(tempPath, OUTPUT_WEBM, 'webm')

    await rm(tempDir, { recursive: true, force: true })

    return NextResponse.json({
      message: 'Hero video uploaded and optimized successfully',
      mp4: '/hero-video.mp4',
      webm: '/hero-video.webm'
    })
  } catch (error) {
    console.error('Hero video upload failed:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload hero video' },
      { status: 500 }
    )
  }
}


