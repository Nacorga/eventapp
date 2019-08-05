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

    return (
        <div>
        </div>
    );

  }

}

export default AllEvents;
