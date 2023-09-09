import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: '「读」',
    Svg: require('@site/static/img/read.svg').default,
    description: (
      <>
        阅读杰作是享受一场思想盛宴，阅者虽未谋面，得置身高峰。写作是与自己的对话。阅读汲取养分，写作结出硕果。
      </>
    ),
  },
  {
    title: '「思」',
    Svg: require('@site/static/img/brain.svg').default,
    description: (
      <>
        真知灼见往往来源于简单的原理和朴素的思想。见微知著，拨开云雾见南山。
      </>
    ),
  },
  {
    title: '「用」',
    Svg: require('@site/static/img/human-evolution.svg').default,
    description: (
      <>        
        纸上得来终觉浅，绝知此事要躬行。只有跨上单车，重复练习才能掌控骑行，不要怕把手弄脏。
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
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

export default function HomepageFeatures(): JSX.Element {
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
