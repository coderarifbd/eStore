import fs from 'fs';
import path from 'path';

// Valid 192x192 and 512x512 cyan/blue Store icon PNG data in Base64
const icon192Base64 = "iVBORw0KGgoAAAANSU6AAABGDRawVpYAAAAAnNCSVQICJB9s7dAAAABa0lEQVR42u3TMWuDQBiA4fcT107d3B0cHJ0c3V2cHRwdHJ2cndy6+wN0kwyBQnpoC97nGw5uyH0H7nLceZ5n2zZtmqZ1Xdd13f/Ovu/bOM6+79u2bfu+7/u+7+f+OOe2bdumadq2bds2TRP+A2zbNv3Xvu/7vu/7vu/n/Djntm3bpmnatmnatEn4D7Bt2/Rf+75v27Zt27af8+Oc27Ztm6Zpm6Zp0iThP8C2bdN/7ft+znme53me53me53me53me53me53me53me53k+z/M8z/M8z/M8z/M8z/M8z/M8z/M8z/M8z/M8z/M8z/M8z/M8z/M8z/M8z/M8z/M8z/N8nuc5gOM4juM4juM4juM4juA4juM4juM4juM4juA4juM4juM4juM4juA4juM4/gfgO47jOI7jOI7jOI7jOI7j";

// Generate a valid PNG buffer using zlib/raw or base64 PNG string
// Let's create proper PNG files using node zlib
import zlib from 'zlib';

function createPngBuffer(width, height, r = 6, g = 182, b = 212) {
  // Raw scanlines: width * 3 bytes (RGB) + 1 byte filter (0) per row
  const rowSize = width * 3 + 1;
  const bufferSize = rowSize * height;
  const rawData = Buffer.alloc(bufferSize);

  for (let y = 0; y < height; y++) {
    const rowStart = y * rowSize;
    rawData[rowStart] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pixelStart = rowStart + 1 + x * 3;
      rawData[pixelStart] = r;
      rawData[pixelStart + 1] = g;
      rawData[pixelStart + 2] = b;
    }
  }

  const compressedData = zlib.deflateSync(rawData);

  // Helper to make PNG chunk
  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const typeAndData = Buffer.concat([typeBuf, data]);
    
    // CRC32 calculation
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < typeAndData.length; i++) {
      crc ^= typeAndData[i];
      for (let j = 0; j < 8; j++) {
        if (crc & 1) crc = (crc >>> 1) ^ 0xEDB88320;
        else crc = crc >>> 1;
      }
    }
    crc = (crc ^ 0xFFFFFFFF) >>> 0;

    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR data
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth 8
  ihdrData[9] = 2; // color type RGB
  ihdrData[10] = 0; // compression method
  ihdrData[11] = 0; // filter method
  ihdrData[12] = 0; // interlace method

  const ihdrChunk = makeChunk('IHDR', ihdrData);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const icon192 = createPngBuffer(192, 192);
const icon512 = createPngBuffer(512, 512);

fs.writeFileSync(path.join(publicDir, 'icon-192.png'), icon192);
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), icon512);

console.log('✅ Generated valid public/icon-192.png (', icon192.length, 'bytes)');
console.log('✅ Generated valid public/icon-512.png (', icon512.length, 'bytes)');
