import styles from './main.module.css';
import { redirect } from 'next/navigation';
import ControlPanelTabber from './client';

export default async function Home() {
  
  const overlayData = await fetch('http://localhost:3000/api/overlay', { cache: 'no-store' })
    .then(r => r.json());
  
  const votingData = await fetch('http://localhost:3000/api/voting', {cache: 'no-cache'})
    .then(r => r.json());

  async function updateOverlay(formData: FormData) {
    'use server';

    const params = new URLSearchParams();
    formData.forEach((value, key) => params.set(key, value.toString()));

    if (params.get('status')) params.set('status', showHideString(params.get('status')))
    if (params.get('placements')) params.set('placements', showHideString(params.get('placements')))

    await fetch(`http://localhost:3000/api/overlay?${params.toString()}`);
    redirect('/');
  }

  async function updateVoting(formData: FormData) {
    'use server';

    const params = new URLSearchParams();
    formData.forEach((value, key) => params.append(key, value.toString()));

    if (params.get('status')) params.set('status', showHideString(params.get('status')))

    await fetch(`http://localhost:3000/api/voting?${params.toString()}`);
   
  }

  async function resetOverlay(formData: FormData) {
    'use server';
    await fetch('http://localhost:3000/api/overlay?reset=true')
    redirect('/')
  }

  async function resetVoting(formData: FormData) {
    'use server';
    await fetch('http://localhost:3000/api/voting?reset=true')
    redirect('/')
  }

  return (
    <div className={styles.ctrl}>
      <h1>MCC Live Show - Graphics Control Panel</h1>

      <ControlPanelTabber
        overlay={
          <section>
            <h2>Overlay</h2>

            <h3>Game Number</h3>
            <form action={updateOverlay} className={styles.entry}>
              <input type="number" name="gameNo" defaultValue={overlayData.gameNumber} />
              <button type="submit">OK</button>
            </form>

            <h3>Game</h3>
            <form action={updateOverlay} className={styles.entry}>
              <input type="text" name="game" defaultValue={overlayData.game} />
              <button type="submit">OK</button>
            </form>

            <h3>Placements (name - score)</h3>
            {overlayData.placements.map((place: any, i: number) => (
              <div key={i} className={styles.entry}>
                <span className={styles.entry_heading}>{i + 1}</span>
                <form action={updateOverlay}>
                  <input type="hidden" name="place" value={i + 1} />
                  <input type="text" name="placeName" defaultValue={place.name} required />
                  <input type="number" name="placeScore" defaultValue={place.score} />
                  <button type="submit">OK</button>
                </form>
              </div>
            ))}

            <h3>Toggle Display (show/hide)</h3>
            <div className={styles.entry}>
              <span className={styles.entry_heading_extended}>Status</span>
              <form action={updateOverlay}>
                <input type="hidden" name="status" value={"false"} />
                <input type="checkbox" name="status" defaultChecked={overlayData.statusVisible}/>
                <button type="submit">OK</button>
              </form>
            </div>
            <div className={styles.entry}>
              <span className={styles.entry_heading_extended}>Placements</span>
              <form action={updateOverlay}>
                <input type="hidden" name="placements" value={"false"} />
                <input type="checkbox" name="placements" defaultChecked={overlayData.placementsVisible}/>
                <button type="submit">OK</button>
              </form>
            </div>

            <h3>Reset Overlay</h3>
            <form className={styles.entry} action={resetOverlay}>
              <input type="submit" value="RESET OVERLAY (can't be undone)"/>
            </form>
          </section>
        }
        voting={
          <section>
            <h2>Voting</h2>
          <h3>Voting Slots</h3>
          {votingData.slots.map((slot: any, i: number) => (
            <div key={i} className={styles.entry}>
              <span className={styles.entry_heading}>{i + 1}</span>
              <form action={updateVoting}>
                <input type="hidden" name="slot" value={i + 1} />
                <input type="text" name="game" defaultValue={slot.game} required />
                <button type="submit">OK</button>
              </form>
            </div>
          ))}
          <h3>Choose a game based on slot (have to manually refresh to update everything on here)</h3>
          <form className={styles.entry} action={updateVoting}>
            <input name="slotChosen" type="number"/>
            <button type="submit">OK</button>
          </form>
          <h3>Toggle Display (show/hide)</h3>
          <form className={styles.entry} action={updateOverlay}>
            <input type="hidden" name="status" value={"false"} />
            <input type="checkbox" name="status" defaultChecked={votingData.visible}/>
            <button type="submit">OK</button>
          </form>
          <h3>Reset Overlay</h3>
          <form className={styles.entry} action={resetVoting}>
            <input type="submit" value="RESET OVERLAY (can't be undone)"/>
          </form>
          </section>
        }/>
      </div>
  );
}

const showHideString = (option: string | null) => {
    if (option == "true" || option == "on") return "show";
    else return "hide";
}