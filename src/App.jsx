import React, { useEffect, useState } from "react"


function formatTimer(timeInSeconds) {
  const minutes = Math.floor((timeInSeconds / 60) % 61);
  const seconds = (timeInSeconds) % 60;
  const formatMin = minutes.toString().padStart(2, '0');
  const formatSec = seconds.toString().padStart(2, '0');
  return [formatMin, formatSec]
}

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [itsRunning, setItsRunning] = useState(false);
  const [seconds, setSeconds] = useState(sessionLength * 60);
  const [minTimer, setMinTimer] = useState([sessionLength, '00']);
  const [itsSession, setItsSession] = useState(true);
  const [timeOutActive, setTimeOutActive] = useState(null);

  useEffect(() => {
    let interval;
    if (itsRunning) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds >= 0) {
            let values = formatTimer(prevSeconds)
            setMinTimer(values)

            if (prevSeconds === 0) {
              if (itsSession) {
                setItsSession(false);
                let sound = document.getElementById('beep');
                sound.play()
                setMinTimer([breakLength < 10 ? `0${breakLength}` : breakLength, '00']);
                setTimeOutActive(
                  setTimeout(() => {
                    sound.pause()
                    setTimeOutActive(null);
                    setSeconds(breakLength * 60)
                  }, 5000)
                );
              } else {
                setItsSession(true);
                let sound = document.getElementById('beep');
                setMinTimer([sessionLength < 10 ? `0${sessionLength}` : sessionLength, '00']);
                sound.play()
                setTimeOutActive(
                  setTimeout(() => {
                    sound.pause()
                    setTimeOutActive(null);
                    setSeconds(sessionLength * 60)
                  }, 5000)
                );
              }
            }
            return prevSeconds - 1;
          }
        })
      }, 1000)
      if (timeOutActive) {
        clearTimeout(timeOutActive);
      }
    }

    return () => clearInterval(interval);
  }, [itsRunning, itsSession, sessionLength, breakLength])

  const handlePlay = () => {
    setItsRunning((prev) => (!prev))
  }

  const handleLeft = (option) => {
    if (option === 'up' && breakLength === 60 || option === 'down' && breakLength === 1) return

    if (option === 'up') {
      setBreakLength((prevState) => {
        if (!itsSession) {
          setItsSession(true);
          setSeconds(sessionLength * 60);
          setMinTimer([sessionLength < 10 ? `0${sessionLength}` : sessionLength, '00'])
        }
        return (prevState + 1) % 61
      })
    } else {
      if (!itsSession) {
        setItsSession(true);
        setSeconds(sessionLength * 60);
        setMinTimer([sessionLength < 10 ? `0${sessionLength}` : sessionLength, '00'])
      }
      setBreakLength((prevState) => (prevState - 1) % 61)
    }
  }

  const handleRight = (option) => {
    if (option === 'up' && sessionLength === 60 || option === 'down' && sessionLength === 1) return
    if (option === 'up') {
      setSessionLength((prevState) => {

        let timing = [(prevState + 1) % 61 < 10 ? `0${(prevState + 1) % 61}` : (prevState + 1) % 61, '00']
        setItsSession(true);
        setSeconds((prevState + 1) * 60);
        setMinTimer(timing);
        return (prevState + 1) % 61
      })
    } else {
      setSessionLength((prevState) => {
        let timing = [(prevState - 1) % 61 < 10 ? `0${(prevState - 1) % 61}` : (prevState - 1) % 61, '00']
        setItsSession(true);
        setSeconds((prevState - 1) * 60);
        setMinTimer(timing);
        return (prevState - 1) % 61
      })
    }
  }

  const handleReset = () => {
    setItsSession(true);
    setItsRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setSeconds(25 * 60)
    setMinTimer([25, '00'])
    if (timeOutActive) {
      clearTimeout(timeOutActive); // Clear the active timeout
      setTimeOutActive(null);
    }
  }

  return (
    <>
      <div className="set-time">
        <h3 id='break-label'>Break Length</h3>
        <button onClick={ () => handleLeft('up') } className='butt-size b' disabled={ itsRunning ? true : false }
          id='break-increment'>
          <i className="fa-solid fa-caret-up"></i>
        </button>
        <div className='butt-size' id='break-length'>{ breakLength }</div>
        <button onClick={ () => handleLeft('down') } className='butt-size b' disabled={ itsRunning ? true : false }
          id='break-decrement'>
          <i className="fa-solid fa-caret-down"></i>
        </button>
      </div>
      <div className="set-time">
        <h3 id='session-label'>Session Length</h3>
        <button onClick={ () => handleRight('up') } className='butt-size b' disabled={ itsRunning ? true : false }
          id='session-increment'>
          <i className="fa-solid fa-caret-up"></i>
        </button>
        <div className='butt-size' id='session-length'>{ sessionLength }</div>
        <button onClick={ () => handleRight('down') } className='butt-size b' disabled={ itsRunning ? true : false }
          id='session-decrement'>
          <i className="fa-solid fa-caret-down"></i>
        </button>
      </div>
      <div className='session-container'>
        <h3 id="timer-label">{ itsSession ? 'Session' : 'Break' }</h3>
        <div id='time-left'
          style={ { color: seconds < 180 && itsRunning ? 'red' : 'inherit' } }>
          { `${minTimer[0]}:${minTimer[1]}` }</div>
        <audio id="beep" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"></audio>
      </div >
      <div id="controllers">
        <button onClick={ () => handlePlay() } id="start_stop">
          <i className="fa-solid fa-play"></i>
        </button>
        <button onClick={ () => handleReset() } id="reset">
          <i className="fa-solid fa-arrow-rotate-left"></i>
        </button>
      </div>
    </>
  )
}

export default App