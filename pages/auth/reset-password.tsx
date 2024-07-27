import { useState } from 'react'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    if (res.ok) {
      console.log('Parola sıfırlama isteği gönderildi.')
    } else {
      console.error('Parola sıfırlama isteği gönderilirken hata oluştu.')
    }
  }

  return (
    <main className="flex flex-col p-4">
      <h1>Parola Sıfırlama</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Parolayı Sıfırla</button>
      </form>
    </main>
  )
}
