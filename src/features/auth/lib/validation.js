const labels = { fullName: 'your full name', email: 'your email address', storeName: 'your store name', targetDomain: 'your target domain', password: 'your password', confirmPassword: 'your password again' }

export function validateField(name, value, values = {}) {
  const missing = name === 'password' || name === 'confirmPassword' ? !value : !value.trim()
  if (missing) return `Enter ${labels[name]}.`
  if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Enter a valid email address, like you@example.com.'
  if (name === 'confirmPassword' && value !== values.password) return 'Passwords do not match. Enter the same password.'
  // Password policy and target-domain format are unresolved. Never transform passwords.
  return ''
}
