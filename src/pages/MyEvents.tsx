import React, { Component } from 'react';
import axios from 'axios';
import '../styles/AllEvents.scss';
import { DayEventsI, EventI } from '../helpers/interfaces';

class MyEvents extends Component {

  state = {
    events: [],
  }

  componentDidMount() {
    axios.get(`https://5d48447c2d59e50014f209ff.mockapi.io/trivago/my-events`)
      .then(res => {
        this.setState({ events: res.data });
        this.getEventsDays();
      })
  }

  getEventsDays() {

    const events = this.state.events;

    events.forEach((event: EventI) => {
      event.startDate = new Date(event.startDate);
    })

    return events.map((event: EventI, i) => {

      return (

        <div className="card events-card mb-3">
          <div className="event-row" key={"event-row-" + i}>
            <div className="hour">
              <span>{ `${event.startDate.getHours()}:${(event.startDate.getMinutes()<10?'0':'') + event.startDate.getMinutes()}` }</span>
            </div>
            <div className="content">
              <p>{ event.name }<span className="free-event ml-3">{event.isFree ? 'Free' : null}</span></p>
              <div className="event-details">
                <div className="location mr-3">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{ event.city.name }</span>
                </div>
                <div className="duration">
                  <i className="fas fa-stopwatch"></i>
                  <span>{ event.duration}</span>
                </div>
              </div>
            </div>
            <div className="buttons">
              <button className="btn sign-up">Sign down</button>
            </div>
          </div>
        </div>

      )
    })

  }

  render() {

    return (
      <div className="events-container">
        { this.getEventsDays() }
      </div>
    );

  }

}

export default MyEvents;
