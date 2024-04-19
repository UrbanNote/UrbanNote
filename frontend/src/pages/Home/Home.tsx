import { useTranslation } from 'react-i18next';

import { getUsualFirstName } from '$helpers';
import { usePageDetails } from '$hooks';
import { useAppSelector } from '$store';

const VERSION = process.env.VERSION;

function Home() {
  const { t } = useTranslation('home');
  usePageDetails({ title: t('title') });
  const profile = useAppSelector(state => state.user.profile);
  const displayName = getUsualFirstName(profile);

  return (
    <>
      <h1>{t('greeting', { name: displayName })}</h1>
      <p>UrbanNote v{VERSION}</p>
    </>
  );
}

export default Home;
