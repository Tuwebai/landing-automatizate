import { useEffect, useState } from 'react'

export function useWindowWidth(defaultWidth = 1200) {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : defaultWidth)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)

    window.addEventListener('resize', handleResize, { passive: true })

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowWidth
}
