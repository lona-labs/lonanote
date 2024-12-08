const { execSync } = require('child_process');
const icongen = require('icon-gen');
const path = require('path');
const pngToIco = require('png-to-ico');
const { argv } = require('process');
const fs = require('fs');
const sharp = require('sharp');

const npm = 'pnpm';

const cwdPath = process.cwd();
const tmpPath = path.join(cwdPath, 'node_modules/.cache/icon');
const appPath = 'src-rs';

const createRoundedCornerMask = async (width, height) => {
  // const radius = 22.37
  // return Buffer.from(
  //   `<svg viewBox="0 0 ${width} ${height}">
  //     <rect x="0" y="0" width="${width}" height="${height}" rx="${radius}%" ry="${radius}%" shape-rendering="geometricPrecision" />
  //   </svg>`,
  // );
  return await sharp('./public/mask.png').resize(width, height).toBuffer();
};

function parseCommandLineArgs() {
  const args = process.argv.slice(2); // 获取命令行参数
  const result = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const nextArg = args[i + 1];
      if (nextArg && !nextArg.startsWith('--')) {
        result[key] = nextArg;
        i++;
      } else {
        result[key] = true;
      }
    }
  }
  return result;
}

const handleIcon = async (iconPath, outputPath, rounded, size, blankSpace, background) => {
  const outputDir = path.dirname(outputPath);
  const outputName = path.basename(outputPath);
  const blank = blankSpace || 0;

  let image = sharp(iconPath);
  const metadata = await image.metadata();
  const width = size?.width || metadata.width || 1024;
  const height = size?.height || metadata.height || 1024;

  image.resize(width, height, { fit: 'fill' });
  if (rounded) {
    const buf = await image
      .composite([
        {
          input: await createRoundedCornerMask(width, height),
          gravity: 'northwest',
          blend: 'dest-in',
        },
      ])
      .toBuffer();
    image = sharp(buf);
  }
  if (blank > 0) {
    const w = width - blank * 2;
    const h = height - blank * 2;
    image = image.resize(w, h, { fit: 'fill' }).extend({
      top: blank,
      bottom: blank,
      left: blank,
      right: blank,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    });
  }
  if (outputName.endsWith('.ico') || outputName.endsWith('.icns')) {
    image = image.png();
    if (!fs.existsSync(tmpPath)) {
      fs.mkdirSync(tmpPath, { recursive: true });
    }
    const tempPath = path.join(tmpPath, '____temp.png');
    await new Promise((resolve) => {
      image.toFile(tempPath, (err, info) => {
        if (err) {
          console.error('error processing image:', err);
          resolve();
        } else {
          resolve();
        }
      });
    });
    if (fs.existsSync(tempPath)) {
      const isIco = outputName.endsWith('.ico');
      const isIcns = outputName.endsWith('.icns');
      if (isIco) {
        // const name = outputName.substring(0, outputName.length - 4);
        // await icongen(tempPath, outputDir, {
        //   report: false,
        //   ico: {
        //     name: name,
        //     // sizes: [32, 16, 24, 48, 64, 128, 256],
        //     // sizes: [32, 16, 24, 48, 64, 256],
        //     sizes: [256, 64, 48, 32],
        //   },
        // });
        const buf = await pngToIco([tempPath]);
        fs.writeFileSync(outputPath, buf);
      } else if (isIcns) {
        const name = outputName.substring(0, outputName.length - 5);
        await icongen(tempPath, outputDir, {
          report: false,
          icns: {
            name: name,
            sizes: [16, 32, 64, 128, 256, 512, 1024],
          },
        });
      }
      fs.rmSync(tempPath);
    } else {
      throw new Error(`input file: ${tempPath} is not found.`);
    }
  } else {
    if (outputName.endsWith('.png')) {
      image = image.png();
    } else if (outputName.endsWith('.jpg') || outputName.endsWith('.jpeg')) {
      image = image.jpeg();
    }
    if (background) {
      image.flatten({ background });
    }
    await new Promise((resolve) => {
      image.toFile(outputPath, (err, info) => {
        if (err) {
          console.error('error processing image:', err);
        } else {
          resolve();
        }
      });
    });
  }
};

const resizeIcon = async (inputPath, outputPath, size, background) => {
  return handleIcon(inputPath, outputPath, false, size, background);
};

const generatePngsIcon = async (name, inputPath, outputPath, sizes, getFileName) => {
  for (let i = 0; i < sizes.length; i++) {
    const size = sizes[i];
    const fileName = getFileName(size);
    console.log(`generate ${name} icon ${fileName}`);
    await resizeIcon(inputPath, path.join(outputPath, fileName), {
      width: size,
      height: size,
    });
  }
};

const generateWinIcon = async (inputPath, outputPath) => {
  console.log('generate win icon', path.basename(outputPath));
  return await handleIcon(inputPath, outputPath, false, {
    width: 256,
    height: 256,
  });
};

const generateMacIcon = async (inputPath, outputPath) => {
  console.log('generate mac icon', path.basename(outputPath));
  return await handleIcon(inputPath, outputPath, false, { width: 1024, height: 1024 });
};

const generateAppxIcon = async (inputPath, outputPath) => {
  console.log('generate appx icon', 'StoreLogo.png');
  await resizeIcon(inputPath, path.join(outputPath, 'StoreLogo.png'), {
    width: 50,
    height: 50,
  });

  const sizes = [30, 44, 71, 89, 107, 142, 150, 284, 310];
  await generatePngsIcon(
    'appx',
    inputPath,
    outputPath,
    sizes,
    (size) => `Square${size}x${size}Logo.png`,
  );
};

const generateDesktopIcon = async (inputPath, outputPath) => {
  const sizes = [32, 128, 256, 512];
  await generatePngsIcon('desktop', inputPath, outputPath, sizes, (size) => {
    if (size === 256) {
      return `128x128@2x.png`;
    } else if (size === 512) {
      return 'icon.png';
    } else {
      return `${size}x${size}.png`;
    }
  });
};

const generateAndroidIcon = async (inputPath, outputPath, background) => {
  const targets = [
    {
      name: 'hdpi',
      size: 49,
      foreground_size: 162,
    },
    {
      name: 'mdpi',
      size: 48,
      foreground_size: 108,
    },
    {
      name: 'xhdpi',
      size: 96,
      foreground_size: 216,
    },
    {
      name: 'xxhdpi',
      size: 144,
      foreground_size: 324,
    },
    {
      name: 'xxxhdpi',
      size: 192,
      foreground_size: 432,
    },
  ];
  const name = 'android';
  for (let i = 0; i < targets.length; i++) {
    const target = targets[i];
    const folderName = `mipmap-${target.name}`;
    const outFolder = path.join(outputPath, folderName);
    if (!fs.existsSync(outFolder)) {
      fs.mkdirSync(outFolder, { recursive: true });
    }
    let fileName;
    fileName = 'ic_launcher_foreground.png';
    console.log(`generate ${name} icon ${folderName}/${fileName}`);
    await resizeIcon(
      inputPath,
      path.join(outFolder, fileName),
      {
        width: target.foreground_size,
        height: target.foreground_size,
      },
      background,
    );

    fileName = 'ic_launcher_round.png';
    console.log(`generate ${name} icon ${folderName}/${fileName}`);
    await resizeIcon(
      inputPath,
      path.join(outFolder, fileName),
      {
        width: target.size,
        height: target.size,
      },
      background,
    );

    fileName = 'ic_launcher.png';
    console.log(`generate ${name} icon ${folderName}/${fileName}`);
    await resizeIcon(
      inputPath,
      path.join(outFolder, fileName),
      {
        width: target.size,
        height: target.size,
      },
      background,
    );
  }
};

const generateIOSIcon = async (inputPath, outputPath, background) => {
  const targets = [
    {
      size: 20,
      multipliers: [1, 2, 3],
      hasExtra: true,
    },
    {
      size: 29,
      multipliers: [1, 2, 3],
      hasExtra: true,
    },
    {
      size: 40,
      multipliers: [1, 2, 3],
      hasExtra: true,
    },
    {
      size: 60,
      multipliers: [2, 3],
      hasExtra: false,
    },
    {
      size: 76,
      multipliers: [1, 2],
      hasExtra: false,
    },
    {
      size: 83.5,
      multipliers: [2],
      hasExtra: false,
    },
    {
      size: 512,
      multipliers: [2],
      hasExtra: false,
    },
  ];
  const name = 'ios';
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }
  for (let i = 0; i < targets.length; i++) {
    const target = targets[i];
    const sizeStr = target.size === 512 ? '512' : `${target.size}x${target.size}`;

    if (target.hasExtra) {
      const size = Math.round(target.size * 2);
      const fileName = `AppIcon-${sizeStr}@2x-1.png`;
      console.log(`generate ${name} icon ${fileName}`);
      await resizeIcon(
        inputPath,
        path.join(outputPath, fileName),
        {
          width: size,
          height: size,
        },
        background,
      );
    }
    for (let x = 0; x < target.multipliers.length; x++) {
      const multiplier = target.multipliers[x];
      const size = Math.round(target.size * multiplier);
      const fileName = `AppIcon-${sizeStr}@${multiplier}x.png`;
      console.log(`generate ${name} icon ${fileName}`);
      await resizeIcon(
        inputPath,
        path.join(outputPath, fileName),
        {
          width: size,
          height: size,
        },
        background,
      );
    }
  }
};

const getAppIconPath = (type) => {
  if (type === 'win') {
    return path.join(cwdPath, appPath, 'icons');
  } else if (type === 'mac') {
    return path.join(cwdPath, appPath, 'icons');
  } else if (type === 'appx') {
    return path.join(cwdPath, appPath, 'icons');
  } else if (type === 'desktop') {
    return path.join(cwdPath, appPath, 'icons');
  } else if (type === 'android') {
    return path.join(cwdPath, appPath, 'gen/android/app/src/main/res');
  } else if (type === 'ios') {
    return path.join(cwdPath, appPath, 'gen/apple/Assets.xcassets/AppIcon.appiconset');
  }
};

const createIcons = async () => {
  const args = parseCommandLineArgs();
  const iconPath = args.input;
  const rounded = args.rounded === undefined ? true : args.rounded;

  const background = { r: 255, g: 255, b: 255, alpha: 1 };

  if (!iconPath) {
    throw new Error('please icon path');
  }
  if (!fs.existsSync(iconPath)) {
    throw new Error(`icon path notfound: ${iconPath}`);
  }

  if (!fs.existsSync(tmpPath)) {
    fs.mkdirSync(tmpPath, { recursive: true });
  }

  const defaultPngPath = path.join(tmpPath, 'icon_default.png');
  const macPngPath = path.join(tmpPath, 'icon_mac.png');

  await handleIcon(iconPath, defaultPngPath, rounded, {
    width: 1024,
    height: 1024,
  });
  await handleIcon(iconPath, macPngPath, rounded, { width: 1024, height: 1024 }, 100);

  const icoPath = path.join(getAppIconPath('win'), 'icon.ico');
  await generateWinIcon(defaultPngPath, icoPath);

  const faviconPath = path.join(path.dirname(iconPath), 'favicon.ico');
  fs.copyFileSync(icoPath, faviconPath);

  const icnsPath = path.join(getAppIconPath('mac'), 'icon.icns');
  await generateMacIcon(macPngPath, icnsPath);

  const appxPath = getAppIconPath('appx');
  await generateAppxIcon(defaultPngPath, appxPath);

  const desktopPath = getAppIconPath('desktop');
  await generateDesktopIcon(defaultPngPath, desktopPath);

  const androidPath = getAppIconPath('android');
  await generateAndroidIcon(defaultPngPath, androidPath);

  const iosPath = getAppIconPath('ios');
  await generateIOSIcon(iconPath, iosPath, background);
};

createIcons();
