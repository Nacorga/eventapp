import React, { Component } from 'react';
import axios from 'axios';
import FormattedEvents from '../shared/FormattedEvents';
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
        <FormattedEvents
          events={this.state.events}
          component={'My events'}
          refreshEvents={this.getMyEvents.bind(this)}
        ></FormattedEvents>
      </div>
    );

  }

}

export default MyEvents;
