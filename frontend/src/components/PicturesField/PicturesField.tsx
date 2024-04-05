import { useEffect, useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
import { AnimatePresence, motion } from 'framer-motion';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import { Image, PlusCircle } from 'react-bootstrap-icons';
import Dropzone from 'react-dropzone';
import type { FileRejection } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

import { fadeIn } from '$animations';
import { Scrollbar } from '$components';
import { uploadImage } from '$firebase/storage';
import { compressImage, convertHeicToJpeg, getFileExtension } from '$helpers';
import { useAlerts, useIsTouchscreen } from '$hooks';
import { useAppSelector } from '$store';

import Preview from './Preview';

import './PicturesField.scss';

type PicturesFieldProps = {
  name: string;
  uploadPath: string;
  hideWhenNotEmpty?: boolean;
  setIsUploading?: (isUploading: boolean) => void;
  onPictureUploaded?: (pictureURL: string) => void;
  setDeleteFileButtonClicked?: (deleteFileButtonClicked: boolean) => void;
};

const MAX_SIZE = 25 * 1024 * 1024; // 25MB

// TODO: create single-only variant using prop 'multiple' (or another component)
function PicturesField<T>({
  name,
  uploadPath,
  hideWhenNotEmpty,
  setIsUploading,
  onPictureUploaded,
  setDeleteFileButtonClicked,
}: PicturesFieldProps) {
  const userId = useAppSelector(state => state.user.id);
  const alert = useAlerts();
  const { t } = useTranslation('common');
  const isTouchscreen = useIsTouchscreen();

  const { values, setFieldValue } = useFormikContext<T>();
  const value = values[name as keyof T] as string[];
  const valueReverse = [...value].reverse();

  const [loadingFiles, setLoadingFiles] = useState(0);
  const [showDropzone, setShowDropzone] = useState(!hideWhenNotEmpty || !value.length);

  useEffect(() => {
    setShowDropzone(!hideWhenNotEmpty || !value.length);
  }, [value.length, hideWhenNotEmpty]);

  const uploadFile = useMutation({
    mutationKey: ['uploadFile'],
    mutationFn: async (file: File) => {
      try {
        let image = file;
        if (file.type === 'image/heic') {
          image = await convertHeicToJpeg(file);
        }

        const compressedImage = await compressImage(image, { maxWidthOrHeight: 1600 });

        const id = uuidv4();
        const extension = getFileExtension(compressedImage);
        const path = `${uploadPath}/${id}.${extension}`;
        await uploadImage(compressedImage, path, userId!);
        onPictureUploaded?.(path);
        return path;
      } catch (error) {
        // TODO: Handle more known errors
        alert(t('picturesField.errors.unknown'), 'danger');
      }
    },
  });

  const handleDrop = async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    for (const rejection of fileRejections) {
      if (rejection.errors.some(error => error.code === 'file-too-large')) {
        alert(t('picturesField.errors.tooLarge', { name: rejection.file.name }), 'danger');
      }

      if (rejection.errors.some(error => error.code === 'file-invalid-type')) {
        alert(t('picturesField.errors.invalidType', { name: rejection.file.name }), 'danger');
      }
    }

    const newValue = value;

    setIsUploading?.(true);
    setLoadingFiles(acceptedFiles.length);

    for (const file of acceptedFiles) {
      const path = await uploadFile.mutateAsync(file);
      setLoadingFiles(prev => prev - 1);

      if (!path || newValue.find(existingPath => existingPath === path)) continue;
      newValue.push(path);
    }

    setIsUploading?.(false);
    setFieldValue(name, newValue);
  };

  const handleDelete = (file: string) => {
    const newValue = value.filter(existingPath => existingPath !== file);
    setFieldValue(name, newValue);
  };

  return (
    <div className="PicturesField">
      <Dropzone
        accept={{
          'image/gif': ['.gif'],
          'image/heic': ['.heic'],
          'image/jpeg': ['.jpg', '.jpeg'],
          'image/png': ['.png'],
        }}
        maxSize={MAX_SIZE}
        disabled={Boolean(loadingFiles)}
        onDrop={handleDrop}
        multiple>
        {({ getRootProps, getInputProps }) => (
          <>
            <AnimatePresence initial={false}>
              {showDropzone && (
                <motion.div
                  {...getRootProps({
                    className: classNames('PicturesField__Dropzone text-center border border-3 p-4 rounded-4 mb-3', {
                      disabled: Boolean(loadingFiles),
                    }),
                  })}
                  {...fadeIn}>
                  <input {...getInputProps()} name={name} />
                  <Image size={48} />
                  <p className="mt-3 mb-0">
                    {isTouchscreen ? t('picturesField.ctaTouchscreen') : t('picturesField.cta')}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            <Stack as={Scrollbar} className="PicturesField__Preview w-100 pb-3" direction="horizontal" gap={3}>
              <AnimatePresence initial={false}>
                {!showDropzone && (
                  <motion.div {...fadeIn}>
                    <Button
                      variant="transparent"
                      className="PicturesField__Preview__Add text-primary rounded-4"
                      onClick={() => setShowDropzone(true)}>
                      <PlusCircle size={32} />
                    </Button>
                  </motion.div>
                )}
                {valueReverse.map(file => (
                  <Preview
                    key={file}
                    file={file}
                    onDelete={() => handleDelete(file)}
                    setDeleteFileButtonClicked={setDeleteFileButtonClicked}
                  />
                ))}
                {loadingFiles > 0 && Array.from({ length: loadingFiles }).map((_, i) => <Preview key={i} />)}
              </AnimatePresence>
            </Stack>
          </>
        )}
      </Dropzone>
    </div>
  );
}

export default PicturesField;
