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
    [key: string]: {status: boolean, value?: string | number},
  }
}

class AllEvents extends Component {

  state: AllEventsStateI = {
    original_events: [],
    events: [],
    cities: [],
    event: undefined,
    open: false,
    filters: {
      text: {status: false, value: ''},
      hour: {status: false, value: 0},
      free: {status: false}
    }
  }

  constructor(props: any) {

    super(props);

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.joinToEvent = this.joinToEvent.bind(this);

    this.filterByText = this.filterByText.bind(this);
    this.filterByStartHour = this.filterByStartHour.bind(this);
    this.filterFreeEvents = this.filterFreeEvents.bind(this);
    this.setFilters = this.setFilters.bind(this);

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

  filterByText(text: string, events: EventI[]) {

    const inputText = text.toLowerCase();

    return events.filter((event: EventI) => {

      const eventName = event.name.toLowerCase();
      const cityName = event.city.name.toLowerCase();

      if (eventName.indexOf(inputText) !== -1 || cityName.indexOf(inputText) !== -1) {
        return event;
      }

    });

  }

  filterByStartHour(value: number, events: EventI[]) {
    switch(value) {
      case 1: { return hourFilter(events, 6, 12); }  
      case 2: { return hourFilter(events, 12, 17); }  
      case 3: { return hourFilter(events, 17, 21); }  
      case 4: { return hourFilterDayChange(events, 21, 6); }
      default: { return events }
    }
  }

  filterFreeEvents(events: EventI[]) {
    return events.filter((event: EventI) => event.isFree);
  }

  setFilters(filter: {type: string, status: boolean, value?: any}) {
    this.setState((prevState: any) => 
      ({ filters: {...prevState.filters, [filter.type]: {
        status: filter.status, value: filter.value }} 
      }),
      () => this.applyFilters()
    );
  }

  applyFilters() {

    if ( Object.values(this.state.filters).every((elem: any) => elem.status === false) ) {

      this.setState({ events: this.state.original_events });

    } else {

      let events: EventI[] = this.state.original_events;
      
      if (this.state.filters.text.status) {
        events = this.filterByText( (this.state.filters.text.value as string), events);
      }
      if (this.state.filters.hour.status) {
        events = this.filterByStartHour((this.state.filters.hour.value as number), events);
      }
      if (this.state.filters.free.status) {
        events = this.filterFreeEvents(events);
      }

      this.setState({events});

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
            textFilter={this.setFilters}
            startHour={this.setFilters}
            showFreeEvents={this.setFilters}>
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