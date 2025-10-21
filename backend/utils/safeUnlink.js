import path from 'path';
import fs from 'fs/promises';

// স্টোর করা পাথ থেকে নিরাপদে আপলোড করা ফাইল ডিলিট করার জন্য হেল্পার ফাংশন
const safeUnlink = async (storedPath) => {
  if (!storedPath) return;
  
  // পাথের শুরু থেকে '/' থাকলে তা সরিয়ে ফেলা হচ্ছে
  const relativePath = storedPath.startsWith('/') ? storedPath.substring(1) : storedPath;
  const fullPath = path.join(process.cwd(), relativePath); // যেমন: project-root/uploads/xxx.webp
  
  try {
    await fs.unlink(fullPath);
  } catch (err) {
    // ফাইল না পাওয়া গেলে শুধু সতর্ক করা হবে, সার্ভার ক্র্যাশ করবে না
    console.warn(`safeUnlink: could not delete file at ${fullPath}`, err.message);
  }
};

export default safeUnlink;