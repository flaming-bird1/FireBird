// scripts/optimize-all-images.cjs
// # 在项目根目录运行
// node scripts/optimize-all-images.cjs
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
    maxWidth: 1200,           // 最大宽度
    maxHeight: 800,           // 最大高度
    quality: 75,              // 质量（75%）
    skipExisting: false,      // 是否跳过已优化的文件（基于文件名）
    backup: true,             // 是否备份原文件
};

// 要优化的目录
const DIRECTORIES = [
    'public/assets/icon',
    'public/images/article_cover',
    'public/images/life',
    'public/images',
    'src/assets/images',
];

// 支持的图片格式
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];

async function compressImage(inputPath, outputPath) {
    try {
        const metadata = await sharp(inputPath).metadata();

        // 计算新尺寸
        let width = metadata.width;
        let height = metadata.height;

        if (width > CONFIG.maxWidth || height > CONFIG.maxHeight) {
            const ratio = Math.min(
                CONFIG.maxWidth / width,
                CONFIG.maxHeight / height
            );
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
        }

        // 压缩图片
        const options = {
            quality: CONFIG.quality,
        };

        if (path.extname(inputPath).toLowerCase() === '.png') {
            options.compressionLevel = 9;
        }

        await sharp(inputPath)
            .resize(width, height, {
                fit: 'inside',
                withoutEnlargement: true,
            })
            .toFormat(metadata.format, options)
            .toFile(outputPath);

        const inputStats = fs.statSync(inputPath);
        const outputStats = fs.statSync(outputPath);

        return {
            success: true,
            originalSize: inputStats.size,
            compressedSize: outputStats.size,
            reduction: ((1 - outputStats.size / inputStats.size) * 100).toFixed(1),
        };
    } catch (error) {
        console.error(`压缩失败 ${inputPath}:`, error.message);
        return {success: false, error: error.message};
    }
}

async function processDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
        console.log(`跳过不存在的目录: ${dirPath}`);
        return {processed: 0, skipped: 0, failed: 0};
    }

    console.log(`\n📁 处理目录: ${dirPath}`);

    let processed = 0;
    let skipped = 0;
    let failed = 0;
    let totalSaved = 0;

    async function scan(currentPath) {
        const items = fs.readdirSync(currentPath);

        for (const item of items) {
            const itemPath = path.join(currentPath, item);
            const stat = fs.statSync(itemPath);

            if (stat.isDirectory()) {
                await scan(itemPath);
            } else {
                const ext = path.extname(item).toLowerCase();

                if (IMAGE_EXTENSIONS.includes(ext)) {
                    // 检查是否已优化（文件名包含_optimized）
                    if (CONFIG.skipExisting && item.includes('_optimized')) {
                        console.log(`  ⏭️  跳过已优化: ${item}`);
                        skipped++;
                        continue;
                    }

                    // 备份原文件
                    let backupPath = null;
                    if (CONFIG.backup) {
                        backupPath = itemPath + '.backup';
                        if (!fs.existsSync(backupPath)) {
                            fs.copyFileSync(itemPath, backupPath);
                        }
                    }

                    // 创建临时输出路径
                    const tempPath = itemPath + '.temp';

                    console.log(`  🔧 优化: ${item}`);
                    const result = await compressImage(itemPath, tempPath);

                    if (result.success) {
                        // 替换原文件
                        fs.unlinkSync(itemPath);
                        fs.renameSync(tempPath, itemPath);

                        const savedKB = (result.originalSize - result.compressedSize) / 1024;
                        totalSaved += savedKB;

                        console.log(`    ✅ 完成: ${(result.compressedSize / 1024 / 1024).toFixed(2)}MB (节省 ${result.reduction}%, ${savedKB.toFixed(0)}KB)`);
                        processed++;
                    } else {
                        // 清理临时文件
                        if (fs.existsSync(tempPath)) {
                            fs.unlinkSync(tempPath);
                        }
                        console.log(`    ❌ 失败: ${result.error}`);
                        failed++;
                    }
                }
            }
        }
    }

    await scan(dirPath);

    return {processed, skipped, failed, totalSaved};
}

async function main() {
    console.log('🚀 开始优化所有图片资源...');
    console.log('='.repeat(50));

    let totalProcessed = 0;
    let totalSkipped = 0;
    let totalFailed = 0;
    let totalSavedKB = 0;

    for (const dir of DIRECTORIES) {
        const result = await processDirectory(dir);
        totalProcessed += result.processed;
        totalSkipped += result.skipped;
        totalFailed += result.failed;
        totalSavedKB += result.totalSaved;
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 优化完成！');
    console.log(`📊 统计:`);
    console.log(`  成功优化: ${totalProcessed} 张图片`);
    console.log(`  跳过: ${totalSkipped} 张`);
    console.log(`  失败: ${totalFailed} 张`);
    console.log(`  总共节省: ${(totalSavedKB / 1024).toFixed(2)} MB`);
    console.log(`\n💡 建议:`);
    console.log(`  1. 运行 npm run build 重新构建`);
    console.log(`  2. 检查 dist/ 目录中的图片大小`);
    console.log(`  3. 部署并测试加载速度`);
}

// 运行
main().catch(console.error);