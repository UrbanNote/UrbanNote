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

export function getFileExtension(file: File | string) {
  if (typeof file === 'string') {
    return file.split('.').pop();
  }

  return file.name.split('.').pop();
}
