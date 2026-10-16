import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AuthForm } from '../components/AuthForm'
import { AuthLayout } from '../components/AuthLayout'
import styles from '../components/AuthLayout.module.css'

export function LoginPage() {
  return <AuthLayout showBackLink={false} footer={<>New to SmartOmni? <Link to="/auth/register">Create account</Link></>}>
    <AuthForm secondaryAction={<Link to="/" className={styles.back}><ArrowLeft size={15} aria-hidden="true" />Back to SmartOmni</Link>} />
  </AuthLayout>
}
