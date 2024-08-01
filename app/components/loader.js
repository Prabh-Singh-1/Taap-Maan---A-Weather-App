import React from 'react';
import styles from '@/app/components/loader.css';

const Loader = () => {
  return (
    <div className={styles.loaderOverlay}>
      <div className={styles.loader}></div>
    </div>
  );
};

export default Loader;
