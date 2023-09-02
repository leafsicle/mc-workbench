import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Grid from '@mui/material/Grid'
import { makeStyles } from '@mui/styles'
const schema = yup
  .object({
    firstName: yup
      .string()
      .required("Your name can't be empty")
      .matches(/^[A-Za-z]+$/, 'Something seems off with your first name')
      .max(
        25,
        'Hold on there, cowboy. That hat is a little too big. Do you have a nickname?'
      ),
    lastName: yup
      .string()
      .required("Your name can't be empty")
      .matches(/^[A-Za-z]+$/, 'Something seems off with your first name')
      .max(
        25,
        'Hold on there, cowboy. That hat is a little too big. Do you have a nickname?'
      ),
    email: yup
      .string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        '${value} is not a valid email'
      )
  })
  .required()

const useStyles = makeStyles({
  formRoot: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    padding: '0 30px',
    margin: '0 auto',
    width: '40%',
    '& input': {
      border: '1px solid black',
      backgroundColor: 'white',
      borderRadius: '5px',
      padding: '5px',
      margin: '5px'
    },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // nth children odd input
    '& input:nth-child(odd)': {
      backgroundColor: 'purple'
    },
    '& input:nth-child(even)': {
      backgroundColor: 'green'
    }
  },
  label: {
    backgroundColor: 'inherit',
  }
})
const ContactForm = () => {
  const classes = useStyles()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema) })

  const onSubmit = data => {
    toast(`${data.firstName} ${data.lastName}`, {
      type: toast.TYPE.SUCCESS,
      position: toast.POSITION.TOP_CENTER,
      autoClose: 1500,
      key: 'submit'
    })
  }
  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form
      onSubmit={handleSubmit(onSubmit)}
      error={errors}
      className={classes.formRoot}
    >
      {['firstName', 'lastName', 'email'].map((fieldName, index) => (
        <Grid container key={index} justifyContent='center' alignItems='center'>
          <Grid item xs={12} sm={6} md={4}>
            <Grid container justifyContent='center' alignItems='center'>
              <Grid item xs={12} sm={6} md={4}>
                <label htmlFor={fieldName} className={classes.label}>
                  {fieldName}
                </label>
              </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <input
                {...register(fieldName)}
                tabIndex={index + 1}
                aria-invalid={errors[fieldName] ? 'true' : 'false'}
              />
            </Grid>
          </Grid>
          {errors[fieldName] && (
            <p key={fieldName} role='alert' style={{ color: 'black' }}>
              {errors[fieldName]?.message}
            </p>
          )}
        </Grid>
      </Grid>
      ))}
      <input type='submit' tabIndex={4} />
      <input type='reset' onClick={reset} tabIndex={5} />
    </form>
  )
}
export default ContactForm
