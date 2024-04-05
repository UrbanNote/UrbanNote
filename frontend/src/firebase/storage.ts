import { httpsCallable } from 'firebase/functions';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import type { UploadMetadata } from 'firebase/storage';

import { functions, storage } from '$firebase';

export async function uploadImage(blob: Blob, path: string, userId: string) {
  const storageRef = ref(storage, path);

  const newMetadata: UploadMetadata = {
    customMetadata: {
      userId,
    },
  };

  await uploadBytes(storageRef, blob, newMetadata);
}

export async function getFileUrl(path: string) {
  const storageRef = ref(storage, path);
  return getDownloadURL(storageRef);
}

export async function deleteFile(paths: string[]) {
  const request = httpsCallable<string[], Promise<void>>(functions, 'storage-deleteFile');
  await request(paths);
}
