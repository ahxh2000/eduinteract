import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import r2Client from '@/lib/r2';
import { subjectConfig } from '@/lib/subjectConfig';
import { toolService } from '@/lib/database';

const FILE_BASE_URL = process.env.FILE_BASE_URL!;

export async function POST(request: NextRequest) {
  try {
    console.log('开始处理上传请求');
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const subject = formData.get('subject') as string;
    const description = formData.get('description') as string;
    
    if (!file) {
      console.log('未找到文件');
      return NextResponse.json({ error: '未找到文件' }, { status: 400 });
    }

    if (!title || !subject || !description) {
      console.log('缺少必要信息');
      return NextResponse.json({ error: '请填写工具标题、学科和描述' }, { status: 400 });
    }

    console.log('文件信息:', { name: file.name, type: file.type, size: file.size });
    console.log('工具信息:', { title, subject, description });

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

    const fileUrl = `${FILE_BASE_URL}${key}`;
    
    // 获取学科信息
    const subjectInfo = subjectConfig[subject as keyof typeof subjectConfig];
    if (!subjectInfo) {
      return NextResponse.json({ error: '无效的学科分类' }, { status: 400 });
    }
    
    // 保存工具记录到数据库
    const toolData = {
      title,
      subject,
      description,
      file_url: fileUrl,
      views: 0,
      is_active: true,
    };

    // 调用数据库服务保存工具记录
    const savedTool = await toolService.saveTool(toolData);
    console.log('工具已保存到数据库:', savedTool);

    return NextResponse.json({ 
      url: fileUrl, 
      toolId: savedTool.id, // 使用真实的数据库ID
      message: '工具上传成功' 
    });
  } catch (error) {
    console.error('上传失败:', error);
    return NextResponse.json({ error: '上传失败' }, { status: 500 });
  }
} 