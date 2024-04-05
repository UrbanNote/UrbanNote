import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import Translate from '@docusaurus/Translate';

const FeatureList = [
  {
    title: <Translate>Simplify expenses management</Translate>,
    Svg: require('@site/static/img/undraw-online-banking.svg').default,
    description: (
      <Translate>
        Save time by letting your workers enter their expenses as they go. Don't lose your invoices again! Take a photo of them and upload them
        directly to the application.
      </Translate>
    ),
  },
  {
    title: <Translate>Local resources at your fingertips</Translate>,
    Svg: require('@site/static/img/undraw-current-location.svg').default,
    description: (
      <Translate>
        Find and index local organizations and services in your area. You won't need to write to your colleagues for a phone number anymore!
      </Translate>
    ),
  },
  {
    title: <Translate>Focus on what really matters</Translate>,
    Svg: require('@site/static/img/undraw-blooming.svg').default,
    description: (
      <Translate>
        Less time spent on administrative tasks means more time to create a blooming impact on your community. You can focus on making the world a
        better place!
      </Translate>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className='text--center'>
        <Svg className={styles.featureSvg} role='img' />
      </div>
      <div className='text--center padding-horiz--md'>
        <Heading as='h3'>{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className='container'>
        <div className='row'>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
