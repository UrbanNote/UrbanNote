import { useTranslation } from 'react-i18next';

import { usePageDetails } from '$hooks';

function Home() {
  const { t } = useTranslation('home');
  usePageDetails({ title: t('title') });

  return <h1>{t('title')}</h1>;
}

export default Home;
