import React, { Component } from 'react';
import axios from 'axios';
import Popup from "reactjs-popup";
import { EventI, CityI } from '../helpers/interfaces';
import FormattedEvents from '../components/FormattedEvents';
import { datePrettier } from '../utils/date-prettier';
import { hourFilter, hourFilterDayChange } from '../utils/hour-filter';
import Filters from '../components/Filters';
import '../styles/Events.scss';

export interface AllEventsStateI {
  original_events: EventI[],
  events: EventI[],
  cities: CityI[],
  event?: EventI,
  open: boolean,
  filters: {
    text: {status: boolean, value: string, events: EventI[]},
    hour: {status: boolean, value: number, events: EventI[]},
    free: {status: boolean, value: boolean, events: EventI[]}
  },
}

class AllEvents extends Component {

  state: AllEventsStateI = {
    original_events: [],
    events: [],
    cities: [],
    event: undefined,
    open: false,
    filters: {
      text: {status: false, value: '', events: []},
      hour: {status: false, value: 0, events: []},
      free: {status: false, value: false, events: []}
    }
  }

  constructor(props: any) {

    super(props);

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.joinToEvent = this.joinToEvent.bind(this);

    this.filterByText = this.filterByText.bind(this);
    this.filterByStartHour = this.filterByStartHour.bind(this);
    this.showFreeEvents = this.showFreeEvents.bind(this);
    this.updateFilterState = this.updateFilterState.bind(this);
    this.checkFilteredEvents = this.checkFilteredEvents.bind(this);

  }

  componentDidMount() {

    axios.all([
      axios.get('https://5d48447c2d59e50014f209ff.mockapi.io/trivago/events'),
      axios.get('https://5d48447c2d59e50014f209ff.mockapi.io/trivago/cities')
    ]).then(axios.spread((events, cities) => {
      this.setState({original_events: events.data});
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

  filterByText(text: string) {

    if (text !== '') {

      const inputText = text.toLowerCase();

      let filteredEvents: EventI[] = this.state.original_events.filter((event: EventI) => {

        const eventName = event.name.toLowerCase();
        const cityName = event.city.name.toLowerCase();

        if (eventName.indexOf(inputText) !== -1 || cityName.indexOf(inputText) !== -1) {
          return event;
        }

      });

      this.updateFilterState('text', true, text, filteredEvents);

    } else {
      this.updateFilterState('text', false, text);
    }

  }

  filterByStartHour(value: number) {

    if (value === 0) {

      this.updateFilterState('hour', false, value);
      return;

    } else {

      let filteredEvents: EventI[] = [];

      switch(value) { 
        case 1: { 
          filteredEvents = hourFilter(this.state.original_events, 6, 12);
          break; 
        }  
        case 2: { 
          filteredEvents = hourFilter(this.state.original_events, 12, 17);
          break; 
        }  
        case 3: { 
          filteredEvents = hourFilter(this.state.original_events, 17, 21);
          break; 
        }  
        case 4: { 
          filteredEvents = hourFilterDayChange(this.state.original_events, 21, 6);
          break; 
        }

      }

      this.updateFilterState('hour', true, value, filteredEvents);

    }

  }

  showFreeEvents(status: boolean) {

    if (!status) {
      this.updateFilterState('free', false, status);
    } else {
      const freeEvents: EventI[] = this.state.events.filter((event: EventI) => event.isFree);
      this.updateFilterState('free', true, status, freeEvents);
    }

  }

  updateFilterState(prop: any, status: boolean, value?: any, events?: EventI[]) {
    if (!status) {
      this.setState((prevState: any) => 
        ({ filters: {...prevState.filters, [prop]: { ...prevState.filters[prop], status, value, events: [] }} }),
        () => this.checkFilteredEvents()
      );
    } else {
      this.setState((prevState: any) => 
        ({ filters: {...prevState.filters, [prop]: { ...prevState.filters[prop], status, value, events }} }),
        () => this.checkFilteredEvents()
      );
    }
  }

  checkFilteredEvents() {

    if ( Object.values(this.state.filters).every((val: {status: boolean}) => val.status === false) ) {
      this.setState({ events: this.state.original_events });
    } else {
      switch(true) {
        case(this.state.filters.text.status): {
          this.setState({ events: this.state.filters.text.events });
          break;
        }
        case(this.state.filters.hour.status): {
          this.setState({ events: this.state.filters.hour.events });
          break;
        }
        case(this.state.filters.free.status): {
          this.setState({ events: this.state.filters.free.events });
          break;
        }
      }
    }

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
            textFilter={this.filterByText}
            startHour={this.filterByStartHour}
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