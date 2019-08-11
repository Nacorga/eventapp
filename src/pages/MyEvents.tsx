import React, { Component } from 'react';
import axios from 'axios';
import FormattedEvents from '../components/FormattedEvents';
import '../styles/Events.scss';

class MyEvents extends Component {

  state = {
    events: [],
  }

  componentDidMount() {
    this.getMyEvents();
  }

  getMyEvents() {
    axios.get(`https://5d48447c2d59e50014f209ff.mockapi.io/trivago/my-events`)
      .then(res => {
        this.setState({ events: res.data });
      })
  }

  render() {

    return (
      <div className="container">
        {
          this.state.events.length > 0 ?
            <FormattedEvents
            events={this.state.events}
            component={'My events'}
            refreshEvents={this.getMyEvents.bind(this)}>
          </FormattedEvents>
          :
          <div className="no-events">
            <span>You are not subscribed to any event</span>
          </div>
        }
      </div>
    );

  }

}

export default MyEvents;
