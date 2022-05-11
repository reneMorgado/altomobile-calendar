import React, { useEffect, useState } from 'react'

const DayCard = ({ className, day }) => {

    const [events, setEvents] = useState([])

    const _fetchEvents = async () =>{
        try {
            const request = await fetch('https://altomobile.blob.core.windows.net/api/test.json')
            const dataFetched = await request.status === 200 ? await request.json() : []
            const requestSession = JSON.parse(sessionStorage.getItem('events'));
            const dataSession = requestSession ? JSON.parse(sessionStorage.getItem('events')) : []
            const newEvents = [...events, ...dataFetched, ...dataSession]
            setEvents(newEvents)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        _fetchEvents()
        // eslint-disable-next-line
    },[])

    const _evaluateEventDay = (year, month, date) => (Number(year) === day.getFullYear()) && (Number(month) === (day.getMonth()+1)) && (Number(date) === day.getDate())
    
    // eslint-disable-next-line
    const _mapEvents = (data) => data.map((event)=>{
        const [eventDate, eventHour] = event.time.split('T',2)
        const [eventYear, eventMonth, eventDay] = eventDate.split('-',3)
        const [eventTime] = eventHour.split('+',1)
        if(_evaluateEventDay(eventYear, eventMonth, eventDay)){
            return <div my-date={`${_fillDateAmount(day.getFullYear())}-${_fillDateAmount(day.getMonth()+1)}-${day.getDate()}T`} className='event-card' key={event.name}>{event.name} {eventTime}</div>
        }
    })

    const _addEventHandler = (e) => {
        if(e.detail === 2){
            let eventName;
            let eventHour;
            let eventMinutes;
            while(true){
                let name = prompt("Enter a name for your event")
                let regex = /^[a-z]+$/i
                if(regex.test(name)){
                    eventName = name
                    break;
                }else{
                    alert("Please enter a valid event name");
                }
            }
            while(true){
                let hour = prompt("Enter ONLY hour for your event (24 hours format)", "18")
                let hourNumber = Number(hour)
                if(!(isNaN(hourNumber)) && hourNumber < 25 && hourNumber >= 0){
                    if(hourNumber === 0){
                        eventHour = "00"
                    }else{
                        eventHour = hourNumber
                    }
                    break;
                }else{
                    alert("Please enter a valid event hour");
                }
            }
            while(true){
                let minutes = prompt("Enter ONLY minutes for your event (00-60)", "38")
                let minutesNumber = Number(minutes)
                if(!(isNaN(minutesNumber)) && minutesNumber < 61 && minutesNumber >= 0){
                    if(minutesNumber === 0){
                        eventMinutes = "00"
                    }else{
                        eventMinutes = minutesNumber
                    }
                    break;
                }else{
                    alert("Please enter a valid event minutes");
                }
            }
            let dateEvent = e.target.getAttribute('my-date')+eventHour+":"+eventMinutes+":00+00:00"
            let event = {
                time: dateEvent,
                name: eventName
            }
            _saveEventProcess(event)
        }
    }

    const _saveEventProcess = (event) => {
        const newEvents = [...events, event]
        setEvents(newEvents)
        sessionStorage.setItem('events', JSON.stringify(newEvents))
    }

    const _fillDateAmount = (number) => number < 10 ? "0" + number : number
    
    return (
        <div onClick={_addEventHandler} my-date={`${_fillDateAmount(day.getFullYear())}-${_fillDateAmount(day.getMonth()+1)}-${day.getDate()}T`} className={className}>
            <span my-date={`${_fillDateAmount(day.getFullYear())}-${_fillDateAmount(day.getMonth()+1)}-${day.getDate()}T`}>{day.getDate()}</span>
            <div className="events" my-date={`${_fillDateAmount(day.getFullYear())}-${_fillDateAmount(day.getMonth()+1)}-${day.getDate()}T`}>
                {_mapEvents(events)}
            </div>
        </div>
    )
}

export default DayCard