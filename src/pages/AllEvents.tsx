import React, { Component } from 'react';
import axios from 'axios';
import '../styles/AllEvents.scss';

class AllEvents extends Component {

  state = {
    events: [],
    cities: []
  }

  componentDidMount() {

    axios.get('https://5d48447c2d59e50014f209ff.mockapi.io/trivago/events')
      .then(res => {
          const events = res.data;
          this.setState({ events });
        })

    axios.get('https://5d48447c2d59e50014f209ff.mockapi.io/trivago/cities')
      .then(res => {
          const cities = res.data;
          this.setState({ cities });
      })

  }

  render() {

    let dict: any[] = [];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];

    this.state.events.forEach((event: any, i) => {

      event.startDate = new Date(event.startDate);

      const dictKey: any = `${ event.startDate.getDate()}${event.startDate.getMonth()}${event.startDate.getFullYear() }`;
      const dateFormatted = `${ days[event.startDate.getDay()] } ${ event.startDate.getDate() } ${ months[event.startDate.getMonth()] }`;

      if (!dict[dictKey]) {

        dict[dictKey] = [
          {
            id: dictKey,
            dateFormatted,
            events: []
          }
        ];

      }

      if (dictKey === dict[dictKey][0].id) {
        dict[dictKey][0].events.push(event);
      }
      
    });

    const eventsDays = getEventsDays();

    function getEventsDays() {

      return dict.map((day: any) => {
          

          return (

            <div className="day-events">
  
              <h2 className="day-title">{ day[0].dateFormatted }</h2>
      
              <div className="card events-card">
                {
                  day[0].events.map((event: any) => {
                    return (
                      <p>{ event.name }</p>
                    )
                  })
                }
              </div>

            </div>
    
          )

      }

    )}

    return (
      <div className="events-container">
        { eventsDays }
      </div>
    );

  }

}

export default AllEvents;
