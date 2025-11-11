import React, { useState } from "react"
import Button from "@mui/material/Button"
import { useForm } from "react-hook-form"
import useToast from "../../hooks/useToast"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import Grid from "@mui/material/Grid"
import { styled } from "@mui/material/styles"
import Socials from "../socials"

const schema = yup
  .object({
    firstName: yup
      .string()
      .required("Your name can't be empty")
      .matches(/^[A-Za-z]+$/, "Something seems off with your first name")
      .max(25, "Hold on there, cowboy. That hat is a little too big. Do you have a nickname?"),
    lastName: yup
      .string()
      .required("Your name can't be empty")
      .matches(/^[A-Za-z]+$/, "Something seems off with your first name")
      .max(25, "Hold on there, cowboy. That hat is a little too big. Do you have a nickname?"),
    email: yup
      .string()
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "${value} is not a valid email")
  })
  .required()

const secondarySchema = yup
  .object({
    firstName: yup
      .string()
      .required("Your name ddddddcan't be empty")
      .matches(/^[A-Za-z]+$/, "Something seems off with your first name")
      .max(25, "Hold on there, cowboy. That hat is a little too big. Do you have a nickname?"),
    lastName: yup.string().optional(),
    email: yup
      .string()
      .optional()
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "${value} is not a valid email"),
    message: yup.string().optional()
  })
  .optional()

const FormRoot = styled("form")(({ theme }) => ({
  background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  border: 0,
  borderRadius: 3,
  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  color: "white",
  padding: "1rem",
  margin: "2rem auto",
  width: "40%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  "& input": {
    border: "1px solid black",
    backgroundColor: "white",
    borderRadius: "5px",
    padding: "5px",
    margin: "5px"
  },
  "& input:nth-child(odd)": {
    backgroundColor: theme.palette.background.dark
  },
  "& input:nth-child(even)": {
    backgroundColor: theme.palette.background.default
  }
}))

const StyledLabel = styled("label")({
  backgroundColor: "inherit"
})

const ContactForm = () => {
  const showToast = useToast()
  const [isPrimaryForm, setIsPrimaryForm] = useState(true)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ resolver: yupResolver(isPrimaryForm ? schema : secondarySchema) })

  const fields = [
    { name: "firstName", label: "First Name" },
    { name: "lastName", label: "Last Name" },
    { name: "email", label: "Email" }
  ]

  const plumberFields = [
    { name: "firstName", label: "First Name" },
    { name: "profession", label: "Profession" },
    { name: "tools", label: "Tools" }
  ]

  const formFields = isPrimaryForm ? fields : plumberFields

  const onSubmit = (data) => {
    showToast(`I see you${data.firstName ? `, ${data.firstName} ${data.lastName}` : ""}`, {
      type: "success",
      key: "submit"
    })
  }
  return (
    <Grid container justifyContent="center" direction="column">
      <Grid item xs={12} sm={9}>
        <Button onClick={() => setIsPrimaryForm(!isPrimaryForm)}>
          {isPrimaryForm ? "Switch to Plumber Form" : "Switch to Primary Form"}
        </Button>
        <FormRoot onSubmit={handleSubmit(onSubmit)}>
          {formFields.map((field, index) => (
            <Grid container key={field.name} justifyCnontent="center" alignItems="center">
              <Grid item xs={12} sm={6} md={4}>
                <Grid container>
                  <Grid item xs={12} sm={6} md={4}>
                    <StyledLabel htmlFor={field.name}>{field.label}</StyledLabel>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <input
                      {...register(field.name)}
                      id={field.name}
                      tabIndex={index + 1}
                      aria-invalid={errors[field.name] ? "true" : "false"}
                    />
                  </Grid>
                </Grid>
                {errors[field.name] && (
                  <p key={field.name} role="alert" style={{ color: "black" }}>
                    {errors[field.name]?.message}
                  </p>
                )}
              </Grid>
            </Grid>
          ))}
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Submit
          </Button>
          <Button type="reset" variant="contained" sx={{ mt: 2 }} onClick={reset}>
            Reset
          </Button>
        </FormRoot>
      </Grid>
      <Grid item xs={12}>
        <Socials />
      </Grid>
    </Grid>
  )
}
export default ContactForm
