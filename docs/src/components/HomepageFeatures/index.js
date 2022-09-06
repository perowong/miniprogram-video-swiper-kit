import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Easy to Use',
    Svg: require('@site/static/img/undraw_miniprogram_mountain.svg').default,
    description: (
      <>
        miniprogram-video-components were designed from the ground up to be easily installed and
        used to integrate into your miniprogram and running quickly.
      </>
    )
  },
  {
    title: 'Focus on What Matters',
    Svg: require('@site/static/img/undraw_miniprogram_tree.svg').default,
    description: (
      <>
        Such as video-swiper lets you focus on your community product features, and we&apos;ll do
        the chores. Go ahead and move the components you'd like into your <code>features</code>{' '}
        directory;)
      </>
    )
  },
  {
    title: 'Flexible',
    Svg: require('@site/static/img/undraw_miniprogram_wechat.svg').default,
    description: (
      <>
        These components works individually in weChat miniprogram, and also can combined together to
        works in your particular business scenario.
      </>
    )
  }
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
