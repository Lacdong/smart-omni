import { useState } from 'react'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/shared/ui/dialog'
import { inviteStaff, staffPermissions, updateStaff, useTeam } from './lib/merchantStore'
import styles from './StoreSettings.module.css'

export function PermissionFields({ value, onChange }) {
  return <fieldset className={styles.checks}><legend>Staff permissions</legend>{staffPermissions.map(permission => <label key={permission.id}><input type="checkbox" checked={value.includes(permission.id)} onChange={event => onChange(event.target.checked ? [...value, permission.id] : value.filter(id => id !== permission.id))} />{permission.label}</label>)}</fieldset>
}

export default function TeamPage() {
  const team = useTeam()
  const [email, setEmail] = useState('')
  const [permissions, setPermissions] = useState(['orders:read'])
  const [feedback, setFeedback] = useState(null)
  const [confirmation, setConfirmation] = useState(null)
  function run(action, message) {
    try { action(); setFeedback({ message }); return true } catch (error) { setFeedback({ error: true, message: error.message }); return false }
  }
  function invite(event) {
    event.preventDefault()
    if (run(() => inviteStaff(email, permissions), 'Demo invitation created. No email was sent.')) setEmail('')
  }
  function confirm() {
    run(() => updateStaff(confirmation.member.id, { status: confirmation.status }), 'Membership updated in this browser.')
    setConfirmation(null)
  }
  return <div className={styles.page}>
    <div className={styles.heading}><div><h1>Team</h1><p>Invite staff and manage their access to your demo workspace.</p></div></div>
    {feedback && <p role={feedback.error ? 'alert' : 'status'} className={`${styles.notice} ${feedback.error ? styles.error : ''}`}>{feedback.message}</p>}
    <section className={styles.panel}><h2>Invite a team member</h2><p>Use staff@smartomni.demo to test acceptance from the staff account. Other email addresses remain pending demo invitations.</p>
      <form className={styles.form} onSubmit={invite}><label className={styles.field}>Staff email<input type="email" required maxLength={254} value={email} onChange={event => { setEmail(event.target.value); setFeedback(null) }} /></label><PermissionFields value={permissions} onChange={setPermissions} /><div className={styles.actions}><Button type="submit">Create demo invitation</Button></div></form>
    </section>
    <section className={styles.panel}><h2>Members & invitations</h2><p>The owner keeps full access. Staff only see the read permissions granted here.</p>
      {!team.length ? <p>No staff invitations yet.</p> : <ul className={styles.members}>{team.map(member => <li className={styles.member} key={member.id}><div><strong>{member.email}</strong><small>{member.status === 'INVITED' ? 'Invitation pending' : member.status === 'ACTIVE' ? 'Active member' : member.status === 'SUSPENDED' ? 'Access suspended' : 'Access revoked'} · {new Date(member.invitedAt).toLocaleDateString('en-GB')}</small></div>
        {member.status !== 'REVOKED' && <><MemberPermissions key={`${member.id}-${member.permissions.join(',')}`} member={member} save={value => run(() => updateStaff(member.id, { permissions: value }), 'Staff permissions saved.')} /><div className={styles.actions}>
          {member.status === 'ACTIVE' && <Button variant="outline" className={styles.danger} onClick={() => setConfirmation({ member, status: 'SUSPENDED', label: 'Suspend access' })}>Suspend access</Button>}
          {member.status === 'SUSPENDED' && <Button variant="outline" onClick={() => run(() => updateStaff(member.id, { status: 'ACTIVE' }), 'Staff access restored.')}>Restore access</Button>}
          <Button variant="outline" className={styles.danger} onClick={() => setConfirmation({ member, status: 'REVOKED', label: member.status === 'INVITED' ? 'Revoke invitation' : 'Remove member' })}>{member.status === 'INVITED' ? 'Revoke invitation' : 'Remove member'}</Button>
        </div></>}
      </li>)}</ul>}
    </section>
    <p className={styles.notice}>Browser-only demo. Email delivery, server authorization, invitation expiry and subscription staff limits require backend integration.</p>
    <Dialog open={Boolean(confirmation)} onOpenChange={open => { if (!open) setConfirmation(null) }}><DialogContent className={styles.dialog}><DialogTitle>{confirmation?.label}?</DialogTitle><DialogDescription>{confirmation?.member.email} will lose access to this demo workspace. You can restore suspended access or create a new invitation after removal.</DialogDescription><div className={styles.actions}><Button variant="outline" onClick={() => setConfirmation(null)}>Cancel</Button><Button variant="outline" className={styles.danger} onClick={confirm}>{confirmation?.label}</Button></div></DialogContent></Dialog>
  </div>
}

function MemberPermissions({ member, save }) {
  const [value, setValue] = useState(member.permissions)
  const changed = value.join(',') !== member.permissions.join(',')
  return <form className={styles.form} onSubmit={event => { event.preventDefault(); save(value) }}><PermissionFields value={value} onChange={setValue} /><div className={styles.actions}><Button variant="outline" type="submit" disabled={!changed}>Save permissions</Button></div></form>
}
