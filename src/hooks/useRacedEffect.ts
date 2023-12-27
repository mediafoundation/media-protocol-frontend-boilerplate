import { useEffect, useState } from "react"

function useRacedEffect(effect: () => void, delay = 1000) {
  const [raceEnded, setRaceEnded] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setRaceEnded(true)
    }, delay)
  }, [])

  useEffect(() => {
    if (raceEnded) effect()
  }, [raceEnded])
}

export default useRacedEffect
