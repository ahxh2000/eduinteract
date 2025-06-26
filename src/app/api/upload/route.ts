import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import r2Client from '@/lib/r2';

export async function POST(request: NextRequest) {
  try {
    console.log('开始处理上传请求');
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      console.log('未找到文件');
      return NextResponse.json({ error: '未找到文件' }, { status: 400 });
    }

    console.log('文件信息:', { name: file.name, type: file.type, size: file.size });

    // 类型和大小校验
    if (file.type !== 'text/html') {
      console.log('文件类型校验失败:', file.type);
      return NextResponse.json({ error: '只支持 HTML 文件' }, { status: 400 });
    }
    if (file.size > 100 * 1024) {
      console.log('文件大小校验失败:', file.size);
      return NextResponse.json({ error: '文件大小不能超过 100KB' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = `uploads/${Date.now()}-${file.name}`;
    console.log('准备上传到 R2，key:', key);

    await r2Client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );
    console.log('文件已成功上传到 R2');

    const fileUrl = `https://h5.sunodownload.net/${key}`;
    console.log('返回文件 URL:', fileUrl);
    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error('上传失败:', error);
    return NextResponse.json({ error: '上传失败' }, { status: 500 });
  }
} 