import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/ui/button'
import { askDemoAdvisor, forecastRows } from './lib/ownerWorkspaceStore'
import { Feedback, OwnerPanel } from './components/OwnerWorkspaceUI'
import styles from './OwnerWorkspace.module.css'

export default function AdvisorWorkspace({ screen, state }) {
  const [question, setQuestion] = useState('')
  const [feedback, setFeedback] = useState(null)
  const rows = forecastRows(state)
  function ask(event) {
    event.preventDefault()
    try { askDemoAdvisor(question); setQuestion(''); setFeedback(null) } catch (error) { setFeedback({ error: true, message: error.message }) }
  }
  return screen === 'advisor' ? <>
    <OwnerPanel title="Ask the AI advisor · demo"><p>This preview uses fixed local response templates for inventory, forecast, costs/profit and loyalty. It does not call an AI model or send your question to a service.</p><div className={styles.actions}>{['Review inventory risk', 'Review business costs', 'Review loyalty vouchers'].map(prompt => <Button key={prompt} variant="outline" onClick={() => setQuestion(prompt)}>{prompt}</Button>)}</div><form className={styles.form} onSubmit={ask}><label className={styles.field}>Your question<textarea required maxLength={1000} value={question} onChange={event => setQuestion(event.target.value)} /></label><div className={styles.actions}><Button type="submit">Ask in demo</Button></div><Feedback value={feedback} /></form></OwnerPanel>
    <OwnerPanel title="Conversation history">{state.conversations.length ? <ol className={styles.list}>{[...state.conversations].reverse().map(item => <li key={item.id}><h3>You asked</h3><p className={styles.message}>{item.question}</p><h3>Demo advisor</h3><p className={styles.message}>{item.answer}</p><span className={styles.note}>{new Date(item.at).toLocaleString('en-GB')} · local template response</span></li>)}</ol> : <p>No questions yet. Choose a prompt or enter a question above.</p>}</OwnerPanel>
  </> : <OwnerPanel title="Strategic advice · sample workspace"><p>Rule-based observations from the current local scenario. No AI model, training pipeline or live business data is connected.</p><ul className={styles.list}>
    <li><h3>Review stock coverage before a sales event</h3><p>{rows.filter(item => item.shortfall > 0).length} sample SKUs have a projected shortfall for 24–30 Oct 2026. Compare the saved event uplift with stock availability and supplier lead times.</p><Link to="/merchant/forecasts">View demand forecasts</Link></li>
    <li><h3>Reconcile the cost ledger</h3><p>{state.costs.length} local cost entries are available. Check product costs, marketplace fees, shipping and returns before using the profit estimate.</p><Link to="/merchant/profit">Review profit calculation</Link></li>
    <li><h3>Preview campaign recipients</h3><p>{state.vouchers.length} local voucher batches exist. Review opt-in and discount cost before applying a campaign on a marketplace.</p><Link to="/merchant/voucher-results">Review voucher results</Link></li>
  </ul><p className={styles.note}>These observations are demo examples and require verification against real records before action.</p></OwnerPanel>
}
