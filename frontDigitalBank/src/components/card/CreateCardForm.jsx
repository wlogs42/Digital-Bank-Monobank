import {z} from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import TextField from '../common/TextField'
import Button from '../common/Button'
import { useForm } from 'react-hook-form'


const schema = z.object({
    cardType: z.enum(['Debit', 'Credit']),
    name: z.string().min(1, "Введіть ім'я на картці").max(100),
    firstName: z.string().min(1, 'Введіть прізвище на картці').max(100),
  initialAmount: z.coerce.number().min(0, "Сума не може бути від'ємною"),
  currency: z.enum(['UAH', 'USD', 'EUR']),
})

const currencyToEnum = {UAH: 0, USD: 1, EUR: 0}

export default function CreateCardForm({userId, onCreated}){

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { cardType: 'Debit', currency: 'UAH', initialAmount: 0 },
  })

  const onSubmit = async(data)=>{
    await onCreated({
      userId,
      cardType: data.cardType,
      name: data.name,
      firstName: data.firstName,
      initialAmount: data.initialAmount,
      currency: currencyToEnum[data.currency],
    })
  }

  return(
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <TextField label="Ім'я на картці" {...register('name')} error={errors.name?.message} />
        <TextField label="Прізвище на картці" {...register('firstName')} error={errors.firstName?.message} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm text-muted">Тип картки</span>
          <select {...register('cardType')} className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <option value="Debit">Дебетова</option>
            <option value="Credit">Кредитна</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm text-muted">Валюта</span>
          <select {...register('currency')} className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <option value="UAH">UAH</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </label>
      </div>
      <TextField label="Початковий баланс" type="number" step="0.01" {...register('initialAmount')} error={errors.initialAmount?.message} />
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Створюємо...' : 'Відкрити картку'}
      </Button>
    </form>
  )
}