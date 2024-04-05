import { useState, type PropsWithChildren } from 'react';

import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import { ExclamationCircle, XCircleFill } from 'react-bootstrap-icons';

import { fadeIn } from '$animations';
import { Scrollbar } from '$components';
import { getFileUrl } from '$firebase/storage';

export type PreviewProps = {
  file?: string;
  onDelete?: () => void;
  setDeleteFileButtonClicked?: (deleteFileButtonClicked: boolean) => void;
};

export type WrapperProps = PropsWithChildren<{
  error?: boolean;
  loading?: boolean;
  onClick?: () => void;
}>;

function Wrapper({ error, loading, children, onClick }: WrapperProps) {
  return (
    <Scrollbar
      as={motion.div}
      {...fadeIn}
      className={classNames(
        'PicturesField__Preview__Wrapper d-flex flex-column justify-content-center align-items-center',
        {
          'border rounded-3': error || loading,
          'border-danger text-danger error': error,
          'border-info text-info loading': loading,
        },
      )}
      onClick={onClick}>
      {children}
    </Scrollbar>
  );
}

function Preview({ file, onDelete, setDeleteFileButtonClicked }: PreviewProps) {
  const [showImage, setShowImage] = useState(false);

  const { data, error, isLoading } = useQuery({
    queryKey: ['getFile', file],
    queryFn: async () => {
      if (!file) return null;
      setDeleteFileButtonClicked?.(false);
      return getFileUrl(file);
    },
  });

  if (!file || isLoading)
    return (
      <Wrapper loading>
        <Spinner />
      </Wrapper>
    );

  if (error)
    return (
      <Wrapper error>
        <ExclamationCircle size={32} />
      </Wrapper>
    );
  return (
    <>
      <Wrapper onClick={() => setShowImage(true)}>
        <img src={data!} alt={file} />
        {onDelete && (
          <Button
            className="DeleteButton"
            onClick={e => {
              e.stopPropagation(); // Prevent the click from opening the image
              onDelete();
              setDeleteFileButtonClicked?.(true);
            }}>
            <XCircleFill />
          </Button>
        )}
      </Wrapper>
      <Modal show={showImage} onHide={() => setShowImage(false)} size="lg" centered>
        <img src={data!} alt={file} className="w-100" />
      </Modal>
    </>
  );
}

export default Preview;
