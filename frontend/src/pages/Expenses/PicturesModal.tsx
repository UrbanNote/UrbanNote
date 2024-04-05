import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel';
import Modal from 'react-bootstrap/Modal';
import { BoxArrowUpRight } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import type { ExpenseDetails } from '$firebase/expenses';
import { getFileUrl } from '$firebase/storage';

type PicturesModalProps = {
  expense?: ExpenseDetails;
  show: boolean;
  onHide: () => void;
};

function PicturesModal({ expense, show, onHide }: PicturesModalProps) {
  const { t } = useTranslation('expenses');
  const [index, setIndex] = useState(0);

  const pictureURLs = useQuery({
    queryKey: ['getPictureURLs', show, expense?.id],
    queryFn: async () => Promise.all(expense?.pictureURL?.map(picture => getFileUrl(picture)) ?? []),
  });

  const handleHide = () => {
    setIndex(0);
    onHide();
  };

  const handleClickPrevious = () => setIndex(prev => Math.max(prev - 1, 0));
  const handleClickNext = () => setIndex(prev => Math.min(prev + 1, pictureURLs.data!.length - 1));

  if (!expense || !pictureURLs.data?.length) return null;

  return (
    <Modal show={show} onHide={handleHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('picturesModal.title', { title: expense.title })}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        <Carousel activeIndex={index} interval={null} controls={false}>
          {pictureURLs.data.map(url => (
            <Carousel.Item key={url} className="bg-dark ratio ratio-1x1">
              <img src={url} alt={expense.title} className="object-fit-cover" />
            </Carousel.Item>
          ))}
        </Carousel>
        {pictureURLs.data.length > 1 && (
          <div className="d-flex align-items-center justify-content-center gap-3 py-3">
            <Button variant="link" onClick={handleClickPrevious} disabled={index === 0}>
              {t('picturesModal.previous')}
            </Button>
            <Link target="_blank" to={pictureURLs.data[index]} className="btn btn-link">
              {t('picturesModal.index', { index: index + 1, total: pictureURLs.data.length })}{' '}
              <BoxArrowUpRight size={12} className="align-text-top" />
            </Link>
            <Button variant="link" onClick={handleClickNext} disabled={index === pictureURLs.data.length - 1}>
              {t('picturesModal.next')}
            </Button>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default PicturesModal;
