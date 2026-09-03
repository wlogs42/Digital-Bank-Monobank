import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Navbar from '../components/landing/Navbar'
import Container from '../components/common/Container'
import TextField from '../components/common/TextField'
import Button from '../components/common/Button'
import { registerUser } from '../Servises/authService'
import { useAuthStore } from '../store/useAuthStore'

const registerSchema = z
  .object({
    userName: z.string().min(1, 'Введіть username').max(100),
    userFirstName: z.string().min(1, "Введіть ім'я").max(100),
    userLastName: z.string().min(1, 'Введіть прізвище').max(100),
    email: z.string().min(1, 'Введіть email').email('Некоректний email'),
    phoneNumber: z.string().min(1, 'Введіть номер телефону'),
    password: z
      .string()
      .min(8, 'Пароль має бути не менше 8 символів')
      .regex(/[A-Z]/, 'Потрібна хоча б одна велика літера')
      .regex(/[a-z]/, 'Потрібна хоча б одна мала літера')
      .regex(/[0-9]/, 'Потрібна хоча б одна цифра'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Паролі не співпадають',
    path: ['confirmPassword'],
  })

export default function RegisterPage() {
  const [serverError, setServerError] = useState('')
  const setUser = useAuthStore((state) => state.setUser)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data) => {
    setServerError('')

    const payload = {
      userName: data.userName,
      userFirstName: data.userFirstName,
      userLastName: data.userLastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: data.password,
    }

    try {
      const user = await registerUser(payload)
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
          <h1 className="font-display text-2xl font-bold">Реєстрація</h1>
          <p className="mt-2 text-muted">Відкрийте картку за пару хвилин</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <TextField label="Username" {...register('userName')} error={errors.userName?.message} />

            <div className="grid grid-cols-2 gap-4">
              <TextField label="Ім'я" {...register('userFirstName')} error={errors.userFirstName?.message} />
              <TextField label="Прізвище" {...register('userLastName')} error={errors.userLastName?.message} />
            </div>

            <TextField label="Email" type="email" {...register('email')} error={errors.email?.message} />
            <TextField label="Телефон" type="tel" {...register('phoneNumber')} error={errors.phoneNumber?.message} />
            <TextField label="Пароль" type="password" {...register('password')} error={errors.password?.message} />
            <TextField
              label="Підтвердіть пароль"
              type="password"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />

            {serverError && <p className="text-sm text-red-400">{serverError}</p>}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Створюємо акаунт...' : 'Зареєструватись'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Вже маєте акаунт?{' '}
            <Link to="/login" className="text-brand-300 hover:text-brand-100">
              Увійти
            </Link>
          </p>
        </Container>
      </main>
    </div>
  )
}
