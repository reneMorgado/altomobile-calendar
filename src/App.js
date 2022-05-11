import './App.css';
import React,{ useEffect, useState } from 'react';
import DayCard from './components/DayCard';
import { getMonthString } from './helpers/toStrings';

function App() {

  const [days, setDays] = useState([])
  const [currentMonth, setCurrentMonth] = useState(5)
  const [currentYear, setCurrentYear] = useState(2022)

  const _calculateDaysFromMonth = (month, year) => Array.from(
    { length: new Date(year, month, 0).getDate() },
    (_, i) => new Date(year, month - 1, i + 1)
  );

  useEffect(()=>{
    const myDays = _calculateDaysFromMonth(currentMonth, currentYear)
    setDays(myDays)
  },[currentMonth, currentYear])

  const _evaluateCurrentDay = (day, currentDate) => (((day.getDate() === currentDate.getDate()) && (day.getMonth() === currentDate.getMonth()) && (day.getFullYear() === currentDate.getFullYear())))

  const _mapDays = (data) => data.map((day)=>{
    let currentDate = new Date(Date.now())
    let evaluation = _evaluateCurrentDay(day, currentDate)
    return <DayCard key={day} className={`container-column-${day.getDay()} ${evaluation && 'container-day-current'} container-day`} day={day}/>
  })

  const _nextMonth = () => {
    let nextMont = currentMonth + 1
    if (nextMont > 12){
      setCurrentMonth(1)
      let nextYear = currentYear + 1
      setCurrentYear(nextYear)
    } else {
      setCurrentMonth(nextMont)
    }
  }

  const _previousMonth = () => {
    let previousMonth = currentMonth - 1
    if (previousMonth < 1){
      setCurrentMonth(12)
      let previousYear = currentYear - 1
      setCurrentYear(previousYear)
    } else {
      setCurrentMonth(previousMonth)
    }
  }

  return (
    <div className="App">
      <div className='calendar-controls'>
        <button className='' onClick={_previousMonth}>Previous</button>
        <h1 className=''>{getMonthString(currentMonth)} {currentYear}</h1>
        <button className='' onClick={_nextMonth}>Next</button>
      </div>
      <div className='container'>
        <div className='container-column-0 container-label'>Sunday</div>
        <div className='container-column-1 container-label'>Monday</div>
        <div className='container-column-2 container-label'>Tuesday</div>
        <div className='container-column-3 container-label'>Wednesday</div>
        <div className='container-column-4 container-label'>Thursday</div>
        <div className='container-column-5 container-label'>Friday</div>
        <div className='container-column-6 container-label'>Saturday</div>
        {_mapDays(days)}
      </div>
    </div>
  );
}

export default App;
