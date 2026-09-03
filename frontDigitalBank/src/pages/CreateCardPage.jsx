import { ArrowLeft, CreditCard } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import CreateCardForm from '../components/card/CreateCardForm'
import { createCard } from '../Servises/cardService'
import { useAuthStore } from '../store/useAuthStore'
import { useState } from 'react'

export default function CreateCardPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const userId = user?.id
  const [error, setError] = useState('')

  const handleCreateCard = async (payload) => {
    try {
      await createCard({
        ...payload,
        userId,
      })

      navigate('/dashboard')
    } catch (err) {
      setError(
        err.response?.data?.error ??
        'Не вдалося створити картку'
      )
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl">

      <button
        type="button"
        onClick={() => navigate('/dashboard')}
        className="
          mb-6
          flex
          items-center
          gap-2
          text-sm
          text-muted
          transition
          hover:text-fg
        "
      >
        <ArrowLeft size={18} />
        Назад
      </button>

      <div className="mb-6">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400">
          <CreditCard size={24} />
        </div>

        <h1 className="font-display text-2xl font-bold sm:text-3xl">
          Відкрити нову картку
        </h1>

        <p className="mt-2 text-sm text-muted">
          Заповніть дані нижче, щоб створити нову банківську картку.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="rounded-card border border-white/10 bg-surface p-4 sm:p-6">
        <CreateCardForm
          userId={userId}
          onCreated={handleCreateCard}
          onCancel={() => navigate('/dashboard')}
        />
      </div>

    </div>
  )
}