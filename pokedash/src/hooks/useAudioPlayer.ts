import { useEffect, useRef, useState } from 'react'
import { tracks } from '@/data/audioTracks'

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [currentTrack, setCurrentTrack] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // INITIAL AUDIO
  useEffect(() => {
    audioRef.current = new Audio(tracks[0].src)

    return () => {
      audioRef.current?.pause()
    }
  }, [])

  // CHANGE TRACK
  useEffect(() => {
    if (!audioRef.current) return

    audioRef.current.src = tracks[currentTrack].src
    audioRef.current.load()

    if (isPlaying) {
      audioRef.current.play()
    }
  }, [currentTrack])

  // TIME UPDATES
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const setMeta = () => setDuration(audio.duration || 0)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', setMeta)
    audio.addEventListener('ended', nextTrack)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', setMeta)
      audio.removeEventListener('ended', nextTrack)
    }
  }, [])

  // CONTROLS
  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }

    setIsPlaying(!isPlaying)
  }

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length)
  }

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev === 0 ? tracks.length - 1 : prev - 1))
  }

  const seek = (time: number) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = time
    setCurrentTime(time)
  }

  return {
    tracks,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setCurrentTrack,
  }
}
