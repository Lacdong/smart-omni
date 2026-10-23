import { useState } from 'react'
import { Button } from '@/shared/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/shared/ui/dialog'
import { deleteStaff, inviteStaff, staffPermissions, updateStaff, useTeam } from './lib/merchantStore'
import styles from './StoreSettings.module.css'

const statuses = { INVITED: 'Invitation pending', ACTIVE: 'Active member', SUSPENDED: 'Access suspended', REVOKED: 'Access revoked' }
const emptyProfile = { fullName: '', email: '', phone: '', jobTitle: '', notes: '', permissions: ['orders:read'] }
const profileFields = [['fullName', 'Full name', 100], ['phone', 'Phone number', 40], ['jobTitle', 'Job title', 100]]
const displayName = member => member.fullName || member.email
const date = value => value ? new Date(value).toLocaleString('en-GB') : 'Not yet'

function PermissionFields({ value, onChange }) {
  return <fieldset className={styles.checks}><legend>Staff permissions</legend>{staffPermissions.map(permission => <label key={permission.id}><input type="checkbox" checked={value.includes(permission.id)} onChange={event => onChange(event.target.checked ? [...value, permission.id] : value.filter(id => id !== permission.id))} />{permission.label}</label>)}</fieldset>
}

function StaffFields({ value, onChange, emailLocked = false }) {
  const change = event => onChange({ ...value, [event.target.name]: event.target.value })
  return <>
    {profileFields.map(([name, label, maxLength]) => <label key={name} className={styles.field}>{label}<input name={name} type={name === 'phone' ? 'tel' : 'text'} maxLength={maxLength} required={name === 'fullName'} value={value[name]} onChange={change} /></label>)}
    <label className={styles.field}>Staff email<input type="email" name="email" required maxLength={254} value={value.email} onChange={change} readOnly={emailLocked} aria-describedby={emailLocked ? 'staff-email-help' : undefined} />{emailLocked && <span id="staff-email-help" className={styles.hint}>Accepted invitations use this email as the account identity.</span>}</label>
    <label className={styles.field}>Internal notes<textarea name="notes" maxLength={1000} value={value.notes} onChange={change} /></label>
    <PermissionFields value={value.permissions} onChange={permissions => onChange({ ...value, permissions })} />
  </>
}

function Feedback({ value }) {
  return value ? <p role={value.error ? 'alert' : 'status'} className={`${styles.notice} ${value.error ? styles.error : ''}`}>{value.message}</p> : null
}

export default function TeamPage() {
  const team = useTeam()
  const [draft, setDraft] = useState(emptyProfile)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('ALL')
  const [feedback, setFeedback] = useState(null)
  const [createError, setCreateError] = useState(null)
  const [panel, setPanel] = useState(null)
  const [confirmation, setConfirmation] = useState(null)
  const [actionError, setActionError] = useState(null)
  const search = query.trim().toLowerCase()
  const filtered = team.filter(member => (status === 'ALL' || member.status === status) && [member.fullName, member.email, member.phone, member.jobTitle].some(value => value?.toLowerCase().includes(search)))
  const selected = team.find(member => member.id === panel?.member.id)
  function invite(event) {
    event.preventDefault()
    setCreateError(null)
    try {
      inviteStaff(draft.email, draft.permissions, draft)
      setDraft(emptyProfile)
      setFeedback({ message: 'Demo invitation created. No email was sent.' })
      setQuery('')
      setStatus('ALL')
    } catch (error) { setCreateError({ error: true, message: error.message }) }
  }
  function requestAction(member, nextStatus, label) {
    setActionError(null)
    setConfirmation({ member, status: nextStatus, label })
  }
  function confirm() {
    try {
      const { member, status: nextStatus } = confirmation
      if (nextStatus === 'DELETE') deleteStaff(member.id, JSON.stringify(member))
      else updateStaff(member.id, { status: nextStatus }, JSON.stringify(member))
      setFeedback({ message: nextStatus === 'DELETE' ? 'Staff record deleted from this workspace.' : 'Membership updated in this browser.' })
      setConfirmation(null)
    } catch (error) { setActionError({ error: true, message: error.message }) }
  }
  function restore(member) {
    try { updateStaff(member.id, { status: 'ACTIVE' }, JSON.stringify(member)); setFeedback({ message: 'Staff access restored.' }) } catch (error) { setFeedback({ error: true, message: error.message }) }
  }
  return <div className={styles.page}>
    <div className={styles.heading}><div><h1>Team</h1><p>Create staff invitations, view profiles and manage workspace access.</p></div></div>
    <Feedback value={feedback} />
    <section className={styles.panel} aria-labelledby="invite-staff-title"><h2 id="invite-staff-title">Invite a team member</h2><p>Use staff@smartomni.demo to test acceptance. Other email addresses remain pending demo invitations; no email is sent.</p><form className={`${styles.form} ${styles.inviteForm}`} aria-label="Invite staff" onSubmit={invite}><StaffFields value={draft} onChange={value => { setDraft(value); setCreateError(null) }} /><Feedback value={createError} /><div className={styles.actions}><Button type="submit">Create demo invitation</Button><Button variant="secondary" type="button" onClick={() => { setDraft(emptyProfile); setCreateError(null) }}>Reset invitation</Button></div></form></section>
    <section className={styles.panel} aria-labelledby="staff-directory-title"><h2 id="staff-directory-title">Members & invitations</h2><p>The owner keeps full access. Staff only see the read permissions granted here.</p>
      <div className={styles.teamCounts} aria-label="Staff summary">{[['All staff records', team.length], ['Active', team.filter(member => member.status === 'ACTIVE').length], ['Pending', team.filter(member => member.status === 'INVITED').length], ['Suspended', team.filter(member => member.status === 'SUSPENDED').length]].map(([label, count]) => <div key={label}><span>{label}</span><strong>{count}</strong></div>)}</div>
      <div className={styles.teamFilters}><label className={styles.field}>Search staff<input type="search" value={query} placeholder="Name, email, phone or job title" onChange={event => setQuery(event.target.value)} /></label><label className={styles.field}>Staff status<select value={status} onChange={event => setStatus(event.target.value)}><option value="ALL">All statuses</option>{Object.entries(statuses).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label></div>
      <p className={styles.notice} aria-live="polite">Showing {filtered.length} of {team.length} staff records</p>
      {!team.length ? <p>No staff invitations yet. Create an invitation above to add your first team member.</p> : !filtered.length ? <div className={styles.emptyResults}><h3>No staff match these filters.</h3><Button variant="outline" onClick={() => { setQuery(''); setStatus('ALL') }}>Clear filters</Button></div> : <ul className={styles.members}>{filtered.map(member => <li className={styles.member} key={member.id}>
        <div className={styles.memberSummary}><div><strong>{displayName(member)}</strong><small>{member.email}</small>{member.jobTitle && <small>{member.jobTitle}</small>}</div><span className={styles.memberStatus}>{statuses[member.status]}</span></div>
        <span className={styles.hint}>{member.permissions.map(id => staffPermissions.find(permission => permission.id === id)?.label).filter(Boolean).join(' · ') || 'No permissions'}</span>
        <div className={styles.actions}>
          <Button variant="outline" onClick={() => setPanel({ mode: 'view', member })}>View details</Button>
          {member.status !== 'REVOKED' && <Button variant="outline" onClick={() => setPanel({ mode: 'edit', member })}>Edit staff</Button>}
          {member.status === 'ACTIVE' && <Button variant="outline" className={styles.danger} onClick={() => requestAction(member, 'SUSPENDED', 'Suspend access')}>Suspend access</Button>}
          {member.status === 'SUSPENDED' && <Button variant="outline" onClick={() => restore(member)}>Restore access</Button>}
          {member.status !== 'REVOKED' && <Button variant="outline" className={styles.danger} onClick={() => requestAction(member, 'REVOKED', member.status === 'INVITED' ? 'Revoke invitation' : 'Remove member')}>{member.status === 'INVITED' ? 'Revoke invitation' : 'Remove member'}</Button>}
          <Button variant="outline" className={styles.danger} onClick={() => requestAction(member, 'DELETE', 'Delete staff record')}>Delete staff record</Button>
        </div>
      </li>)}</ul>}
    </section>
    <p className={styles.notice}>Browser-only demo. Email delivery, server authorization, invitation expiry and subscription staff limits require backend integration.</p>
    <Dialog open={Boolean(panel)} onOpenChange={open => { if (!open) setPanel(null) }}><DialogContent className={`${styles.dialog} ${styles.staffDialog}`}><DialogTitle>{panel?.mode === 'edit' ? 'Edit staff profile' : 'Staff details'}</DialogTitle><DialogDescription>Manage this staff member’s information and access within Everyday Studio.</DialogDescription>
      {!selected ? <><p>This staff record is no longer available.</p><Button variant="secondary" onClick={() => setPanel(null)}>Close</Button></> : panel.mode === 'edit' ? <StaffEditor key={panel.member.id} member={panel.member} onCancel={() => setPanel(null)} onSaved={() => { setPanel(null); setFeedback({ message: 'Staff profile and permissions saved.' }) }} /> : <>
        <dl className={styles.staffDetails}>{[['Full name', displayName(selected)], ['Email', selected.email], ['Phone', selected.phone || 'Not provided'], ['Job title', selected.jobTitle || 'Not provided'], ['Status', statuses[selected.status]], ['Invited', date(selected.invitedAt)], ['Accepted', date(selected.acceptedAt)], ['Last updated', date(selected.updatedAt || selected.invitedAt)], ['Permissions', selected.permissions.map(id => staffPermissions.find(permission => permission.id === id)?.label).filter(Boolean).join(', ') || 'None'], ['Internal notes', selected.notes || 'Not provided']].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        <div className={styles.actions}><Button variant="secondary" onClick={() => setPanel(null)}>Done</Button>{selected.status !== 'REVOKED' && <Button onClick={() => setPanel({ mode: 'edit', member: selected })}>Edit staff</Button>}</div>
      </>}
    </DialogContent></Dialog>
    <Dialog open={Boolean(confirmation)} onOpenChange={open => { if (!open) setConfirmation(null) }}><DialogContent className={styles.dialog}><DialogTitle>{confirmation?.label}?</DialogTitle><DialogDescription>{confirmation?.status === 'DELETE' ? `${confirmation.member.email} will be removed from this workspace directory and lose workspace access immediately. This record cannot be restored. Their independent sign-in account is retained; a new invitation can be created later.` : `${confirmation?.member.email} will lose access to this demo workspace. You can restore suspended access or create a new invitation after removal.`}</DialogDescription><Feedback value={actionError} /><div className={styles.actions}><Button variant="secondary" onClick={() => setConfirmation(null)}>Cancel</Button><Button variant="outline" className={styles.danger} onClick={confirm}>{confirmation?.label}</Button></div></DialogContent></Dialog>
  </div>
}

function StaffEditor({ member, onCancel, onSaved }) {
  const [value, setValue] = useState({ ...emptyProfile, ...member, fullName: member.fullName || (member.email === 'staff@smartomni.demo' ? 'Jamie Nguyen' : member.email.split('@')[0]) })
  const [feedback, setFeedback] = useState(null)
  function save(event) {
    event.preventDefault()
    try { updateStaff(member.id, value, JSON.stringify(member)); onSaved() } catch (error) { setFeedback({ error: true, message: error.message }) }
  }
  return <form className={styles.form} onSubmit={save}><StaffFields value={value} onChange={next => { setValue(next); setFeedback(null) }} emailLocked={member.status !== 'INVITED'} /><Feedback value={feedback} /><div className={styles.actions}><Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button><Button type="submit">Save staff changes</Button></div></form>
}
