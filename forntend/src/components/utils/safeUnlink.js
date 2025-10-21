// utils/safeUnlink.js
import path from 'path';
import fs from 'fs/promises';

const safeUnlink = async (storedPath) => {
  if (!storedPath) return;
  const rel = storedPath.replace(/^\//, ''); // leading slash সরাও
  const fullPath = path.join(process.cwd(), rel); // project-root/uploads/xxx.webp
  try {
    await fs.unlink(fullPath);
  } catch (err) {
    console.warn('safeUnlink: could not delete file', fullPath, err.message);
  }
};

export default safeUnlink;
