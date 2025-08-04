import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import archiver from 'archiver';
import { PassThrough } from 'stream';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('file') as File[];
    const format = formData.get('format') as string;
    const quality = parseInt(formData.get('quality') as string) || 80;

    // Validate inputs
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    if (!['avif', 'webp'].includes(format)) {
      return NextResponse.json(
        { error: 'Invalid format. Only AVIF and WebP are supported.' },
        { status: 400 }
      );
    }

    if (quality < 1 || quality > 100) {
      return NextResponse.json(
        { error: 'Quality must be between 1 and 100' },
        { status: 400 }
      );
    }

    // Create a PassThrough stream to pipe the ZIP archive
    const zipStream = new PassThrough();

    // Create the archive
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    // Pipe archive data to the stream
    archive.pipe(zipStream);

    // Process each file and append to archive
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      let convertedBuffer;
      if (format === 'avif') {
        convertedBuffer = await sharp(buffer)
          .avif({ quality })
          .toBuffer();
      } else {
        convertedBuffer = await sharp(buffer)
          .webp({ quality })
          .toBuffer();
      }

      // Determine filename for converted file
      const originalName = file.name || 'file';
      const baseName = originalName.replace(/\.[^/.]+$/, '');
      const convertedFileName = `${baseName}.${format}`;

      // Append converted file to archive
      archive.append(convertedBuffer, { name: convertedFileName });
    }

    // Finalize the archive
    await archive.finalize();

    // Convert PassThrough stream to ReadableStream for Next.js
    const readableStream = new ReadableStream({
      start(controller) {
        zipStream.on('data', (chunk) => controller.enqueue(chunk));
        zipStream.on('end', () => controller.close());
        zipStream.on('error', (err) => controller.error(err));
      }
    });

    // Return the ZIP archive as a stream response
    return new NextResponse(readableStream, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="converted_images.zip"`,
      },
    });

  } catch (error) {
    console.error('Image conversion error:', error);
    return NextResponse.json(
      { error: 'Failed to convert images. Please try again.' },
      { status: 500 }
    );
  }
}
