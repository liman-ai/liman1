import { useState } from 'react'
import { useRouter } from 'next/router'

export default function NewPasswordPage() {
  const router = useRouter()
  const { token } = router.query
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (password !== confirmPassword) {
      console.error('Parolalar eşleşmiyor.')
      return
    }

    const res = await fetch('/api/auth/new-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, password }),
    })

    if (res.ok) {
      console.log('Parola başarıyla değiştirildi.')
    } else {
      console.error('Parola değiştirilirken hata oluştu.')
    }
  }

  return (
    <main className="flex flex-col p-4">
      <h1>Yeni Parola Belirleme</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Yeni Parola"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Yeni Parolayı Doğrula"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Parolayı Yenile</button>
      </form>
    </main>
  )
}
