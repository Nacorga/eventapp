import React, { Component } from 'react';
import axios from 'axios';
import Popup from "reactjs-popup";
import { EventI, CityI } from '../helpers/interfaces';
import FormattedEvents from '../components/FormattedEvents';
import { datePrettier } from '../utils/date-prettier';
import Filters from '../components/Filters';
import '../styles/Events.scss';

export interface AllEventsStateI {
  events: EventI[],
  cities: CityI[],
  event?: EventI,
  open: boolean,
}

class AllEvents extends Component {

  state: AllEventsStateI = {
    events: [],
    cities: [],
    event: undefined,
    open: false
  }

  constructor(props: any) {

    super(props);

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.joinToEvent = this.joinToEvent.bind(this);
    this.showFreeEvents = this.showFreeEvents.bind(this);

  }

  componentDidMount() {

    axios.all([
      axios.get('https://5d48447c2d59e50014f209ff.mockapi.io/trivago/events'),
      axios.get('https://5d48447c2d59e50014f209ff.mockapi.io/trivago/cities')
    ]).then(axios.spread((events, cities) => {
      this.setState({events: events.data});
      this.setState({cities: cities.data});
    }))
    .catch(error => console.log(error));

  }

  openModal(event: EventI){
    this.setState({ event, open: true });
  }

  closeModal() {
    this.setState({ event: null, open: false });
  }

  joinToEvent() {
    axios.post(`https://5d48447c2d59e50014f209ff.mockapi.io/trivago/my-events`, this.state.event)
      .then(res => {
        this.setState({ event: null, open: false });
      })
  }

  showFreeEvents() {
    const freeEvents = this.state.events.filter((event: EventI) => event.isFree);
    this.setState({ events: freeEvents });
  }


  render() {

    const contentStyle = {
        maxWidth: "800px",
        width: "90%"
    };

    return [

      <div className="container">

        <div className="row mb-5">
          <Filters
            showFreeEvents={this.showFreeEvents}>
          </Filters>
        </div>

        <FormattedEvents
          events={this.state.events}
          cities={this.state.cities}
          component={'All events'}
          openModal={this.openModal}>
        </FormattedEvents>

      </div>
      
      ,

      <React.Fragment>
          <Popup key="popup" open={this.state.open} lockScroll contentStyle={contentStyle} closeOnDocumentClick={false}>
              {close => (                        
                <div className="react-modal">
                  <div className="react-modal-header">
                    <span>Join the event</span>
                    <button onClick={this.closeModal} className="close-btn">
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  <div className="react-modal-body">
                    <div className="modal-text">
                      <p className="react-modal-description">
                        You are about to sign up for <b>{this.state.event!.name}</b>.
                        This event takes place the {datePrettier(this.state.event!.startDate)} in {this.state.event!.city.name}.
                      </p>
                      <p>Are you sure?</p>
                    </div>
                  </div>
                  <div className="react-modal-footer">
                    <button className="btn mr-3" onClick={this.closeModal}>Cancel</button>
                    <button className="btn" onClick={this.joinToEvent}>Join</button>
                  </div>
                </div>
              )}
          </Popup>
      </React.Fragment>

    ];

  }

}

export default AllEvents;