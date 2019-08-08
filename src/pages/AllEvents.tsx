import React, { Component } from 'react';
import axios from 'axios';
import Popup from "reactjs-popup";
import { AllEventsStateI, DicDayEventsI, DayEventsI, EventI, CityI } from '../helpers/interfaces';
import '../styles/AllEvents.scss';

class AllEvents extends Component {

  state: AllEventsStateI = {
    events: [],
    formattedEvents: [],
    cities: [],
    event: undefined,
    open: false
  }

  constructor(props: any) {

    super(props);

    this.setCityEvent = this.setCityEvent.bind(this);
    this.getEventsDays = this.getEventsDays.bind(this);
    this.setEventDuration = this.setEventDuration.bind(this);
    this.dateMeasure = this.dateMeasure.bind(this);

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.joinToEvent = this.joinToEvent.bind(this);

  }

  componentDidMount() {

    axios.all([
      axios.get('https://5d48447c2d59e50014f209ff.mockapi.io/trivago/events'),
      axios.get('https://5d48447c2d59e50014f209ff.mockapi.io/trivago/cities')
    ]).then(axios.spread((events, cities) => {
      this.setState({events: events.data});
      this.setState({cities: cities.data});
      this.formatEventsData();
    }))
    .catch(error => console.log(error));

  }

  formatEventsData() {

    let dict: DicDayEventsI = {};

    this.state.events.forEach((event: EventI) => {

      event.startDate = new Date(event.startDate);

      const dictKey: string = `${ event.startDate.getDate()}${event.startDate.getMonth()}${event.startDate.getFullYear() }`;
      const dateFormatted = this.datePrettier(event.startDate);

      if (!dict[dictKey]) {

        dict[dictKey] = {
          id: dictKey,
          date_formatted: dateFormatted,
          full_date: new Date(`${dateFormatted} ${event.startDate.getFullYear()}`),
          events: []
        };

      }

      if (dictKey === dict[dictKey].id) {
        this.setCityEvent(event);
        this.setEventDuration(event);
        dict[dictKey].events.push(event);
      }
      
    });

    return this.sortData(dict);

  }

  datePrettier(date: Date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
    return `${ days[date.getDay()] } ${ date.getDate() } ${ months[date.getMonth()] }`;
  }

  setCityEvent(event: EventI) {
    const city: CityI = this.state.cities.find((city: CityI) => event.city === city.id)!;
    if (city) { event.city = city}
  }

  setEventDuration(event: EventI) {
    event.duration = this.dateMeasure(new Date(event.endDate).getTime() - new Date(event.startDate).getTime());
  }

  sortData(dict: DicDayEventsI) {

    const items: DayEventsI[] = Object.keys(dict).map((key) => {
      return dict[key];
    });

    items.forEach((dayEvent: DayEventsI) => {
      this.sortEvents(dayEvent.events);
    });

    return this.sortDays(items);

  }

  dateMeasure(ms: number) {

    var h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    h = h % 24;
  
    return this.setEventDurationFormat(h, m);

  };

  setEventDurationFormat(h: number, m: number) {
    if (h === 0) { return m + 'mins'; }
    if (m === 0) { return h + 'h'; }
    return `${h}h ${m}mins`
  }

  getEventsDays() {

    const events = this.formatEventsData();

    return events.map((dayEvents: DayEventsI, i) => {
        
      return (

        <div className="day-events" key={"day-events-" + i}>

          <h2 className="day-title">{ dayEvents.date_formatted }</h2>
          <div className="card events-card">
            {
              dayEvents.events.map((event: EventI, i) => {

                return (

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
                      <button className="btn sign-up" onClick={this.openModal.bind(this, event)}>Sign up</button>
                    </div>
                  </div>

                )
              })
            }
          </div>

        </div>

      )

    })

  }

  sortDays(dayEvents: DayEventsI[]) {
    return dayEvents.sort((a, b) => (a.full_date > b.full_date) ? 1 : ((b.full_date > a.full_date) ? -1 : 0));
  }

  sortEvents(events: EventI[]) {
    return events.sort((a, b) => (a.startDate > b.startDate) ? 1 : ((b.startDate > a.startDate) ? -1 : 0));
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


  render() {

    const contentStyle = {
        maxWidth: "800px",
        width: "90%"
    };

    return [

      <div className="events-container">
        { this.getEventsDays() }
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
                        This event takes place the {this.datePrettier(this.state.event!.startDate)} in {this.state.event!.city.name}.
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