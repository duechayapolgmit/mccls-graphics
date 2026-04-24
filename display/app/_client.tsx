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

export function DelayedForm({action, children, data}: {action: any, children: React.ReactNode, data: any[]}) {
    const [showRefresh, setRefresh] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData(e.currentTarget);

        // For slotChosen
        if (formData.get('slotChosen')) {
            const chosenSlot = parseInt(formData.get('slotChosen')?.toString() || "0") - 1;
            
            // if within the slots allocated
            if (chosenSlot >= 0 && chosenSlot <= data.length) {
                if (data[chosenSlot].game != "NONE") {
                    setRefresh(true); // if not NONE refresh.
                }
            }; 
        }
    }

    return (
        <form action={action} className={`${styles.entry} relative`} onSubmit={handleSubmit}>
            {children}
            {showRefresh && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.spinner}></div>
                    <p>Updating game slots. Refreshing in 30 seconds.</p>
                </div>
            )}
        </form>
    )
}