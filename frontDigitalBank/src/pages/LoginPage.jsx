import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Navbar from '../components/landing/Navbar'
import Container from '../components/common/Container'
import TextField from '../components/common/TextField'
import Button from '../components/common/Button'
import { loginUser } from '../Servises/authService'
import { useAuthStore } from '../store/useAuthStore'

const loginSchema = z.object({
  email: z.string().min(1, 'Введіть email').email('Некоректний email'),
  password: z.string().min(1, 'Введіть пароль'),
})

export default function LoginPage() {
  const [serverError, setServerError] = useState('')
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data) => {
    setServerError('')

    try {
      const user = await loginUser(data)
      setUser(user)
      navigate('/dashboard', {replace: true})
    } catch (err) {
      setServerError(err.response?.data?.error ?? 'Щось пішло не так, спробуйте ще раз')
    }
  }

  

  return (
    <div className="relative">
      <Navbar />
      <main className="pt-32 pb-20">
        <Container className="max-w-md">
          <h1 className="font-display text-2xl font-bold">Вхід</h1>
          <p className="mt-2 text-muted">Раді бачити вас знову</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <TextField label="Email" type="email" {...register('email')} error={errors.email?.message} />
            <TextField label="Пароль" type="password" {...register('password')} error={errors.password?.message} />

            {serverError && <p className="text-sm text-red-400">{serverError}</p>}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Входимо...' : 'Увійти'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Ще не маєте акаунту?{' '}
            <Link to="/register" className="text-brand-300 hover:text-brand-100">
              Зареєструватись
            </Link>
          </p>
        </Container>
      </main>
    </div>
  )
}
