import { useState, useEffect, useCallback, useRef } from "react"

const useSessionStore = (key, fetcher, options = {}) => {
  const {
    expiryCheck = () => false,
    transform = (data) => data,
    validateData = () => true
  } = options

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Store options in a ref to prevent unnecessary re-renders
  const optionsRef = useRef({ expiryCheck, transform, validateData })

  // Update ref if options change
  useEffect(() => {
    optionsRef.current = { expiryCheck, transform, validateData }
  }, [expiryCheck, transform, validateData])

  const fetchData = useCallback(async () => {
    try {
      const cached = sessionStorage.getItem(key)

      if (cached) {
        const parsedCache = JSON.parse(cached)

        // Use ref values to check cache validity
        if (
          optionsRef.current.validateData(parsedCache) &&
          !optionsRef.current.expiryCheck(parsedCache)
        ) {
          setData(parsedCache)
          setLoading(false)
          return
        }
      }

      const freshData = await fetcher()
      const transformedData = optionsRef.current.transform(freshData)

      sessionStorage.setItem(key, JSON.stringify(transformedData))
      setData(transformedData)
      setLoading(false)
    } catch (err) {
      console.error(`Error in useSessionStore(${key}):`, err)
      setError(err)
      setLoading(false)
    }
  }, [key, fetcher]) // Reduced dependencies

  useEffect(() => {
    let mounted = true

    const execute = async () => {
      if (mounted) {
        await fetchData()
      }
    }

    execute()

    return () => {
      mounted = false
    }
  }, [fetchData])

  return { data, loading, error }
}

export default useSessionStore
