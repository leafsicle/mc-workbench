import { gql } from "@apollo/client"

export const GET_PLANTS = gql`
  query getAllPlants {
    plants {
      name
      careSchedule
      lightPreference
      soilDescription
      description
      image
      imageCredit
      funFact
      funFact2
      price
      quantity
      genus
      species
    }
  }
`
export const ADD_PLANT = gql`
  mutation CreatePlant($input: CreatePlantMutationInput!) {
    createPlant(input: $input) {
      plant {
        name
        lightPreference
        soilDescription
        careSchedule
      }
    }
  }
`
