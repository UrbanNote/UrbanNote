import { useState } from 'react';

import { AnimatePresence } from 'framer-motion';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { CameraVideo } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';

import { YoutubeVideoModal } from '$components';
import { useAlerts, useLocalStorage } from '$hooks';

import type { TrainingVideos } from './trainingVideos';

import './TrainingVideo.scss';

type TrainingVideoProps = {
  video: TrainingVideos;
};

function TrainingVideo({ video }: TrainingVideoProps) {
  const alert = useAlerts();
  const { t } = useTranslation('help');

  const [showModal, setShowModal] = useState(false);
  const [hiddenTrainingVideos, setHiddenTrainingVideos] = useLocalStorage<TrainingVideos[]>('hiddenTrainingVideos', []);
  const visible = !hiddenTrainingVideos.includes(video);

  const handleDismiss = () => {
    if (hiddenTrainingVideos.length === 0) {
      alert(t('trainingVideos.onFirstDissmiss'), 'info');
    }

    setHiddenTrainingVideos([...hiddenTrainingVideos, video]);
  };

  return (
    <AnimatePresence>
      <Alert key="alert" show={visible} variant="info" onClose={handleDismiss} className="mb-4" dismissible>
        <Button variant="link" onClick={() => setShowModal(true)} className="p-0 d-flex align-items-center text-white">
          <CameraVideo size={16} className="me-2 flex-shrink-0" />
          {t(`trainingVideos.${video}.title`)}
        </Button>
      </Alert>
      <YoutubeVideoModal
        key="modal"
        show={showModal}
        onHide={() => setShowModal(false)}
        src={t(`trainingVideos.${video}.src`)}
        title={t(`trainingVideos.${video}.title`)}
      />
    </AnimatePresence>
  );
}

export default TrainingVideo;
