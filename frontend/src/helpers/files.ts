import Compressor from 'compressorjs';

export async function convertHeicToJpeg(selectedFile: File) {
  const heic2any = await import('heic2any');

  let jpegBlob = await heic2any.default({
    blob: selectedFile,
    toType: 'image/jpeg',
    quality: 0.7,
  });

  if (Array.isArray(jpegBlob)) {
    jpegBlob = jpegBlob[0];
  }

  const jpegName = selectedFile.name.replace('.heic', '.jpg');
  const newFile = new File([jpegBlob] as Blob[], jpegName, { type: 'image/jpeg' });

  return newFile;
}

export async function compressImage(file: File, options: { maxWidthOrHeight: number }) {
  return new Promise<File>((resolve, reject) => {
    new Compressor(file, {
      maxWidth: options.maxWidthOrHeight,
      maxHeight: options.maxWidthOrHeight,
      quality: 0.7,
      checkOrientation: false,
      success(result) {
        if (result instanceof File) {
          return resolve(result);
        }

        const resultFile = new File([result], file.name, {
          type: file.type,
          lastModified: file.lastModified,
        });

        resolve(resultFile);
      },
      error(error) {
        reject(error);
      },
    });
  });
}

export function getFileExtension(file: File | string) {
  if (typeof file === 'string') {
    return file.split('.').pop();
  }

  return file.name.split('.').pop();
}
