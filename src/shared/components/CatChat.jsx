import { useState } from 'react'
import { Dialog } from 'radix-ui'
import { ArrowUp, MessageCircle, X } from 'lucide-react'
import styles from './CatChat.module.css'

const mascot = '/images/landing/chat-cat-purple.png'

export function CatChat() {
  const [draft, setDraft] = useState('')

  return <Dialog.Root modal={false}>
    <Dialog.Trigger asChild>
      <button className={styles.launcher} aria-label="Open OmniKat chat">
        <span className={styles.invitation}>Let's Chat with OmniKat <MessageCircle size={14} aria-hidden="true" /></span>
        <span className={styles.mascot}><img src={mascot} alt="" width="66" height="66" draggable="false" /></span>
      </button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Content className={styles.panel} aria-describedby="cat-chat-description">
        <header className={styles.header}>
          <span className={styles.avatar}><img src={mascot} alt="" width="44" height="44" /></span>
          <div><Dialog.Title className={styles.title}>OmniKat</Dialog.Title><Dialog.Description id="cat-chat-description" className={styles.subtitle}>Your SmartOmni AI companion.</Dialog.Description></div>
          <Dialog.Close className={styles.close} aria-label="Close chat"><X size={18} aria-hidden="true" /></Dialog.Close>
        </header>
        <div className={styles.conversation}>
          <span className={styles.eyebrow}>SAY HELLO</span>
          <h3>Hi there. Welcome in!</h3>
          <p className={styles.message}>I’m OmniKat, your SmartOmni AI companion. What would you like to explore?</p>
          <div className={styles.suggestions}>
            {['How does SmartOmni work?', 'Help me explore the store'].map(text => <button key={text} onClick={() => setDraft(text)}>{text}</button>)}
          </div>
        </div>
        <footer className={styles.composer}>
          <div className={styles.inputWrap}>
            <textarea aria-label="Chat message" placeholder="Type a message…" value={draft} onChange={event => setDraft(event.target.value)} rows={2} maxLength={2000} />
            <button disabled aria-label="Send message (preview only)" title="Messaging is not connected yet"><ArrowUp size={18} aria-hidden="true" /></button>
          </div>
          <p>Preview · Messaging is not connected yet.</p>
        </footer>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
}
