import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/appMain/App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ApolloProvider, gql } from '@apollo/client'

import { ApolloClient, InMemoryCache } from '@apollo/client'

const cache = new InMemoryCache()
const client = new ApolloClient({
  cache,
  uri: 'http://localhost:3000/graphql' // replace with your GraphQL server URI
})

// Local state management setup
cache.writeQuery({
  query: gql`
    query GetLocalState {
      localState @client
    }
  `,
  data: {
    localState: {} // replace with your initial local state
  }
})
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter basename='/mc-workbench'>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
)
