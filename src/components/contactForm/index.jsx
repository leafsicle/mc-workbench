import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm()

  const notify = message => toast(message)
  const onSubmit = data => {
    toast('Success Notification !', {
      type: toast.TYPE.SUCCESS,
      position: toast.POSITION.TOP_CENTER,
      autoClose: 3000
    })
  }
  console.log(watch('username')) // watch input value by passing the name of it

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* register your input into the hook by invoking the "register" function */}
      <input defaultValue='' {...register('username', { required: true })} />
      {/* {errors.username && notify(errors.username)} */}

      {/* include validation with required or other standard HTML validation rules */}
      <input {...register('password', { required: true })} />
      {/* errors will return when field validation fails  */}
      {errors.password &&
        toast('Password is required', {
          type: toast.TYPE.error,
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000
        })}

      <input type='submit' />
    </form>
  )
}
export default ContactForm
