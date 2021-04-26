import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { usePlayer } from '../../context/PlayerContext';
import styles from './styles.module.scss';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [progress, setProgress] = useState(0);

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffling,
    nightMode,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    playNext,
    playPrevious,
    setIsPlayingState,
    clearPlayerState,
    hasPrev,
    hasNext,
  } = usePlayer();

  function setupProgressListener() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime))
    })
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount;
    setProgress(amount);

  }

  function handleEpisodeEnded() {
    if (hasNext) {
      playNext();
    } else {
      clearPlayerState();
    }
  }

  const episode = episodeList[currentEpisodeIndex];

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying])
  
  if(!nightMode){
  return (
    <div className={ styles.playerContainer} >
      <header>
        <img src='/playing.svg' alt='Tocando agora' />
        <strong>Tocando agora</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit='cover' />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#8f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            ref={audioRef}
            autoPlay
            loop={isLooping}
            onEnded={() => handleEpisodeEnded()}
            onPlay={() => setIsPlayingState(true)}
            onPause={() => setIsPlayingState(false)}
            onLoadedMetadata={() => setupProgressListener()}
          />
        )}

        <div className={styles.buttons}>

          <button type="button"
            className={isShuffling ? styles.isActive : ''}
            onClick={() => toggleShuffle()}
            disabled={!episode || episodeList.length == 1}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button type="button" onClick={() => playPrevious()} disabled={!hasPrev}>
            <img src="/play-previous.svg" alt="Tocar Anterior" />
          </button>
          <button type="button" className={styles.playButton} disabled={!episode}>
            {isPlaying
              ? <img src="/pause.svg" alt="Pausar" onClick={() => togglePlay()} />
              : <img src="/play.svg" alt="Tocar" onClick={() => togglePlay()} />
            }
          </button>
          <button type="button" onClick={() => playNext()} disabled={!hasNext}>
            <img src="/play-next.svg" alt="Tocar Próximo" />
          </button>
          <button
            type="button"
            className={isLooping ? styles.isActive : ''}
            onClick={() => toggleLoop()}
            disabled={!episode}>
            <img src="/repeat.svg" alt="Repetir" />
          </button>

        </div>
      </footer>
    </div>
  )
          }else{
            return (
              <div className={ styles.nightPlayer} >
                <header>
                  <img src='/playing.svg' alt='Tocando agora' />
                  <strong>Tocando agora</strong>
                </header>
          
                {episode ? (
                  <div className={styles.currentEpisode}>
                    <Image
                      width={592}
                      height={592}
                      src={episode.thumbnail}
                      objectFit='cover' />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                  </div>
                ) : (
                  <div className={styles.emptyPlayerOnNight}>
                    <strong>Selecione um podcast para ouvir</strong>
                  </div>
                )}
          
                <footer className={!episode ? styles.empty : ''}>
                  <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                      {episode ? (
                        <Slider
                          max={episode.duration}
                          value={progress}
                          onChange={handleSeek}
                          trackStyle={{ backgroundColor: '#04d361' }}
                          railStyle={{ backgroundColor: '#50398a' }}
                          handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                        />
                      ) : (
                        <div className={styles.emptySlider} />
                      )}
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                  </div>
          
                  {episode && (
                    <audio
                      src={episode.url}
                      ref={audioRef}
                      autoPlay
                      loop={isLooping}
                      onEnded={() => handleEpisodeEnded()}
                      onPlay={() => setIsPlayingState(true)}
                      onPause={() => setIsPlayingState(false)}
                      onLoadedMetadata={() => setupProgressListener()}
                    />
                  )}
          
                  <div className={styles.nightButtons}>
          
                    <button type="button"
                      className={isShuffling ? styles.isActive : ''}
                      onClick={() => toggleShuffle()}
                      disabled={!episode || episodeList.length == 1}
                    >
                      <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>
                    <button type="button" onClick={() => playPrevious()} disabled={!hasPrev}>
                      <img src="/play-previous.svg" alt="Tocar Anterior" />
                    </button>
                    <button type="button" className={styles.playButton} disabled={!episode}>
                      {isPlaying
                        ? <img src="/pause.svg" alt="Pausar" onClick={() => togglePlay()} />
                        : <img src="/play.svg" alt="Tocar" onClick={() => togglePlay()} />
                      }
                    </button>
                    <button type="button" onClick={() => playNext()} disabled={!hasNext}>
                      <img src="/play-next.svg" alt="Tocar Próximo" />
                    </button>
                    <button
                      type="button"
                      className={isLooping ? styles.isActive : ''}
                      onClick={() => toggleLoop()}
                      disabled={!episode}>
                      <img src="/repeat.svg" alt="Repetir" />
                    </button>
          
                  </div>
                </footer>
              </div>
            )
          }
          
}