import { StorageService } from 'src/shared/storage/services/storage.service';
import { UNSPLASH_CATEGORY_IMAGES } from '../data/playground-jobs.data';
import { Readable } from 'stream';

interface UnsplashPhotoResponse {
  urls?: {
    regular?: string;
    small?: string;
  };
}

export async function downloadAndStoreImagesForJob(
  category: string,
  jobTitle: string,
  count: number,
  storageService: StorageService,
): Promise<{ uploadId: number }[]> {
  const storedUploads: { uploadId: number }[] = [];
  const unsplashAccessKey =
    process.env.UNSPLASH_ACCESS_KEY || process.env.UNSPLASH_API_KEY;

  let apiImageUrls: string[] = [];
  if (unsplashAccessKey) {
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos/random?query=${encodeURIComponent(category)}&orientation=landscape&count=${count}`,
        {
          headers: {
            Authorization: `Client-ID ${unsplashAccessKey}`,
          },
        },
      );
      if (response.ok) {
        const data = (await response.json()) as
          | UnsplashPhotoResponse
          | UnsplashPhotoResponse[];
        const items = Array.isArray(data) ? data : [data];
        apiImageUrls = items
          .map((item) => item.urls?.regular || item.urls?.small)
          .filter((url): url is string => Boolean(url));
      }
    } catch {
      console.warn(
        `⚠️ Unsplash API fetch failed for "${category}", falling back to curated Unsplash images.`,
      );
    }
  }

  const categoryPool =
    UNSPLASH_CATEGORY_IMAGES[category] || UNSPLASH_CATEGORY_IMAGES.default;
  const shuffledPool = [...categoryPool].sort(() => 0.5 - Math.random());

  for (let i = 0; i < count; i++) {
    const url =
      apiImageUrls[i] ||
      shuffledPool[i % shuffledPool.length] ||
      `https://picsum.photos/seed/${encodeURIComponent(jobTitle + '-' + i)}/800/600`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP status ${res.status}`);
      }
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const slugPrefix = category.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const filename = `${slugPrefix}-${Date.now()}-${i + 1}.jpg`;

      const file: Express.Multer.File = {
        fieldname: 'file',
        originalname: filename,
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: buffer.length,
        buffer: buffer,
        destination: '',
        filename: filename,
        path: '',
        stream: new Readable(),
      };

      const upload = await storageService.store(file, false, false);
      storedUploads.push({ uploadId: upload.id });
    } catch {
      try {
        const fallbackUrl = `https://picsum.photos/seed/${encodeURIComponent(jobTitle + '-' + Date.now() + '-' + i)}/800/600`;
        const res = await fetch(fallbackUrl);
        if (res.ok) {
          const arrayBuffer = await res.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const filename = `job-${Date.now()}-${i + 1}.jpg`;

          const file: Express.Multer.File = {
            fieldname: 'file',
            originalname: filename,
            encoding: '7bit',
            mimetype: 'image/jpeg',
            size: buffer.length,
            buffer: buffer,
            destination: '',
            filename: filename,
            path: '',
            stream: new Readable(),
          };

          const upload = await storageService.store(file, false, false);
          storedUploads.push({ uploadId: upload.id });
        }
      } catch {
        console.warn(`⚠️ Failed to store image for "${jobTitle}"`);
      }
    }
  }

  return storedUploads;
}
