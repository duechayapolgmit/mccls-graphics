'use client';
import { useState } from 'react';
import styles from './main.module.css';

export default function ControlPanelTabber({overlay, voting}: { overlay: React.ReactNode, voting: React.ReactNode}) {
  const [activeTab, setActiveTab] = useState('overlay');

  return (
    <div>
      <div className={styles.tabList}>
        <button 
          className={activeTab === 'overlay' ? styles.activeTab : ''} 
          onClick={() => setActiveTab('overlay')}
        >
          Overlay
        </button>
        <button 
          className={activeTab === 'voting' ? styles.activeTab : ''} 
          onClick={() => setActiveTab('voting')}
        >
          Voting
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'overlay' ? overlay : voting}
      </div>
    </div>
  );
}