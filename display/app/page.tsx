import styles from './main.module.css';
import { redirect } from 'next/navigation';
import ControlPanelTabber, { DelayedForm } from './client';

// CONSTANTS
const API_URL = 'http://localhost:3000/api'

// HELPERS
const showHideString = (option: string | null) => ((option == "true" || option == "on") ? "show" : "hide")
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
async function apiFetch(endpoint: string, params?: URLSearchParams) {
  const url = params ? `${API_URL}/${endpoint}?${params.toString()}` : `${API_URL}/${endpoint}`;
  return fetch(url, {cache:'no-store'})
}

export default async function Home() {

  const [overlayData, votingData] = await Promise.all([
    apiFetch('overlay').then(r => r.json()),
    apiFetch('voting').then(r => r.json())
  ]);

  async function updateOverlay(formData: FormData) {
    'use server';

    const params = new URLSearchParams();
    formData.forEach((value, key) => params.set(key, value.toString()));

    if (params.get('status')) params.set('status', showHideString(params.get('status')))
    if (params.get('placements')) params.set('placements', showHideString(params.get('placements')))

    await apiFetch('overlay', params)
    redirect('/');
  }

  async function updateVoting(formData: FormData) {
    'use server';

    const params = new URLSearchParams();
    formData.forEach((value, key) => params.append(key, value.toString()));

    if (params.get('status')) params.set('status', showHideString(params.get('status')))

    await apiFetch('voting', params)

    // Delay for slot chosen, if valid
    if (params.get('slotChosen')) {
      const slotChosen = parseInt(params.get('slotChosen') || "0") - 1;
      if (slotChosen <= -1 || slotChosen > votingData.slots.length) return; // if invalid = return

      const data = votingData.slots[slotChosen].game
      if (data == "NONE") return;

      await wait(30000);
    }
    redirect('/');
  }

  async function resetOverlay() {
    'use server';
    apiFetch('overlay', new URLSearchParams({ reset: 'true' }));
    redirect('/')
  }

  async function resetVoting() {
    'use server';
    apiFetch('voting', new URLSearchParams({ reset: 'true' }));
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
          <h3>Choose a game based on active game slot</h3>
          <DelayedForm action={updateVoting} data={votingData.slots}>
            <input name="slotChosen" type="number"/>
            <button type="submit">OK</button>
          </DelayedForm>
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
