import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import { usePlayer } from '../../context/PlayerContext';
import Image from 'next/image';

import styles from './styles.module.scss';

export function Header() {
  const currentDate = format(new Date, 'EEEEEE, d MMMM', {
    locale: ptBR,
  })

  const { nightMode, toggleMode} = usePlayer();

  return (
    <header className={nightMode ? styles.nightHeader :styles.headerContainer}>
      <img src="/nightLogo.svg" alt='Podcastr'></img>
      <p>O melhor para você ouvir, sempre</p>
      <span> 
        <button onClick={() => toggleMode()}>
            <Image 
            width={30}
            height={30}
            src={!nightMode ? "/day.svg" :"/night.svg"} 
            alt={''}
            />
          </button>
         {currentDate}</span>
    </header>
  )
}
