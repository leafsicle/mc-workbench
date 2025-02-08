import { useState, useEffect } from "react"

const useSessionStore = (key, fetcher, options = {}) => {
  const {
    expiryCheck = () => false, // Default: no expiry check
    transform = (data) => data, // Default: no transformation
    validateData = () => true // Default: all data is valid
  } = options

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check session storage first
        const cached = sessionStorage.getItem(key)

        if (cached) {
          const parsedCache = JSON.parse(cached)

          // Check if cache is valid and not expired
          if (validateData(parsedCache) && !expiryCheck(parsedCache)) {
            setData(parsedCache)
            setLoading(false)
            return
          }
        }

        // Fetch fresh data if cache missing or invalid
        const freshData = await fetcher()
        const transformedData = transform(freshData)

        // Save to session storage
        sessionStorage.setItem(key, JSON.stringify(transformedData))

        setData(transformedData)
        setLoading(false)
      } catch (err) {
        console.error(`Error in useSessionStore(${key}):`, err)
        setError(err)
        setLoading(false)
      }
    }

    fetchData()
  }, [key, expiryCheck, transform, validateData, fetcher])

  return { data, loading, error }
}

export default useSessionStore
