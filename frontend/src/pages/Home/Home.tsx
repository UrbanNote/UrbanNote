import { useTranslation } from 'react-i18next';

import { usePageDetails } from '$hooks';

function Home() {
  const { t } = useTranslation('home');
  usePageDetails({ title: t('title') });

  return (
    <>
      <h1>{t('title')}</h1>
      <p>UrbanNote v{process.env.VERSION}</p>
      {/* TODO: display notice if app is outdated following GitHub migration */}
    </>
  );
}

export default Home;
