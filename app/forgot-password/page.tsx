import { useState } from 'react';
import { useRouter } from 'next/router';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/request-password-reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    if (res.ok) {
      alert('Password reset email sent');
      router.push('/login');
    } else {
      alert('Failed to send password reset email');
    }
  };

  return (
    <main className="flex flex-col p-4">
      <div className="w-full max-w-md mx-auto bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Forgot Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Send Reset Email
          </button>
        </form>
      </div>
    </main>
  );
}
