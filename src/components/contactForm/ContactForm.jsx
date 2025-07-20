import React from "react"
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
    backgroundColor: "purple"
  },
  "& input:nth-child(even)": {
    backgroundColor: "green"
  }
}))

const StyledLabel = styled("label")({
  backgroundColor: "inherit"
})
const ContactForm = () => {
  // styled components used instead of classes
  const showToast = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema) })

  const onSubmit = (data) => {
    showToast(`I see you, ${data.firstName} ${data.lastName}`, {
      type: "success",
      key: "submit"
    })
  }
  return (
    <Grid container justifyContent="center" direction="column">
      <Grid item xs={12} sm={9}>
        <FormRoot onSubmit={handleSubmit(onSubmit)}>
          {["FirstName", "LastName", "Email"].map((fieldName, index) => (
            <Grid container key={index} justifyCnontent="center" alignItems="center">
              <Grid item xs={12} sm={6} md={4}>
                <Grid container>
                  <Grid item xs={12} sm={6} md={4}>
                    <StyledLabel htmlFor={fieldName}>
                      {fieldName.replace(/([A-Z])/g, " $1")}
                    </StyledLabel>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <input
                      {...register(fieldName)}
                      tabIndex={index + 1}
                      aria-invalid={errors[fieldName] ? "true" : "false"}
                    />
                  </Grid>
                </Grid>
                {errors[fieldName] && (
                  <p key={fieldName} role="alert" style={{ color: "black" }}>
                    {errors[fieldName]?.message}
                  </p>
                )}
              </Grid>
            </Grid>
          ))}
          <input type="submit" tabIndex={4} />
          <input type="reset" onClick={reset} tabIndex={5} />
        </FormRoot>
      </Grid>
      <Grid item xs={12}>
        <Socials />
      </Grid>
    </Grid>
  )
}
export default ContactForm
