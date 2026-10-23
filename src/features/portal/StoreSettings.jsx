import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/shared/ui/button'
import { saveStoreSection, useStoreSettings } from './lib/merchantStore'
import styles from './StoreSettings.module.css'

const fields = {
  profile: [['name', 'Store name', 'text', 100], ['email', 'Contact email', 'email', 254], ['phone', 'Contact phone', 'tel', 40], ['description', 'Store description', 'textarea', 500]],
  appearance: [['headline', 'Storefront headline', 'text', 120], ['announcement', 'Announcement', 'text', 200]],
  policies: [['shipping', 'Shipping policy', 'textarea', 3000], ['returns', 'Return policy', 'textarea', 3000], ['privacy', 'Privacy policy', 'textarea', 3000]],
}
const sections = [['profile', 'Store profile'], ['appearance', 'Appearance'], ['policies', 'Store policies']]

export default function StoreSettings() {
  const { pathname } = useLocation()
  const section = pathname.split('/').at(-1)
  const settings = useStoreSettings()
  const selected = fields[section] ? section : 'profile'
  return <div className={styles.page}>
    <div className={styles.heading}><div><h1>Store settings</h1><p>Manage the details customers see in your demo storefront.</p></div><Button asChild variant="outline"><Link to="/store/everyday-studio" target="_blank" rel="noreferrer">Preview storefront</Link></Button></div>
    <nav className={styles.tabs} aria-label="Store settings">{sections.map(([id, label]) => <Link key={id} to={`/merchant/settings/${id}`} aria-current={id === selected ? 'page' : undefined}>{label}</Link>)}</nav>
    <SettingsForm key={selected} section={selected} initial={settings[selected]} />
    <p className={styles.notice}>Demo settings are stored in this browser. Changes appear on the sample storefront; no live store or subdomain is updated.</p>
  </div>
}

function SettingsForm({ section, initial }) {
  const [draft, setDraft] = useState(initial)
  const [feedback, setFeedback] = useState(null)
  const change = event => { setDraft({ ...draft, [event.target.name]: event.target.value }); setFeedback(null) }
  function save(event) {
    event.preventDefault()
    try { saveStoreSection(section, draft); setFeedback({ message: 'Changes saved in this browser.' }) } catch (error) { setFeedback({ error: true, message: error.message }) }
  }
  return <section className={styles.panel}><h2>{sections.find(([id]) => id === section)[1]}</h2><p>{section === 'policies' ? 'Add your own policy wording. Blank policies are hidden from the storefront.' : 'Save changes when you are ready to update the storefront preview.'}</p>
    <form className={styles.form} onSubmit={save}>
      {fields[section].map(([name, label, type, maxLength]) => <label className={styles.field} key={name}>{label}{type === 'textarea' ? <textarea name={name} value={draft[name]} maxLength={maxLength} onChange={change} /> : <input name={name} type={type} value={draft[name]} required={name === 'name'} maxLength={maxLength} onChange={change} />}</label>)}
      {section === 'appearance' && <>
        <label className={styles.field}>Accent palette<select name="accent" value={draft.accent} onChange={change}><option value="neutral">Neutral</option><option value="forest">Forest</option><option value="navy">Navy</option></select></label>
        <label className={styles.field}>Catalog spacing<select name="density" value={draft.density} onChange={change}><option value="comfortable">Comfortable</option><option value="compact">Compact</option></select></label>
        <div className={styles.preview} aria-label="Appearance draft preview">{draft.announcement && <span>{draft.announcement}</span>}<h2>{draft.headline || 'Your storefront headline'}</h2><p>{draft.accent} palette · {draft.density} spacing</p></div>
      </>}
      <div className={styles.actions}><Button type="submit">Save changes</Button><Button type="button" variant="outline" onClick={() => { setDraft(initial); setFeedback(null) }}>Discard changes</Button></div>
      {feedback && <p role={feedback.error ? 'alert' : 'status'} className={`${styles.notice} ${feedback.error ? styles.error : ''}`}>{feedback.message}</p>}
    </form>
  </section>
}
