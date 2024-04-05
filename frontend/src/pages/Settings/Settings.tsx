import { useTranslation } from 'react-i18next';

import { usePageDetails } from '$hooks';

export default function Settings() {
  const { t } = useTranslation('settings');
  usePageDetails({ title: t('title') });

  return (
    <div className="background-app">
      <h1>Page parametre</h1>
    </div>
  );
}
