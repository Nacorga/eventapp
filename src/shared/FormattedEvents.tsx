import React, { Component } from 'react';
import { DicDayEventI, DayEventI, EventI, CityI } from '../helpers/interfaces';
import { datePrettier } from '../utils/date-prettier';
import '../styles/Events.scss';

interface ParentPropsI {
  events: EventI[];
  cities: CityI[],
  component: string,
  openModal: (event: EventI) => void
}

class FormattedEvents extends Component<ParentPropsI> {

  constructor(props: any) {

    super(props);

    this.setCityEvent = this.setCityEvent.bind(this);
    this.getEventsDays = this.getEventsDays.bind(this);
    this.setEventDuration = this.setEventDuration.bind(this);
    this.dateMeasure = this.dateMeasure.bind(this);

  }

  formatEventsData() {

    let dict: DicDayEventI = {};

    this.props.events.forEach((event: EventI) => {

      event.startDate = new Date(event.startDate);

      const dictKey: string = `${ event.startDate.getDate()}${event.startDate.getMonth()}${event.startDate.getFullYear() }`;
      const dateFormatted = datePrettier(event.startDate);

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

  setCityEvent(event: EventI) {
    const city: CityI = this.props.cities.find((city: CityI) => event.city === city.id)!;
    if (city) { event.city = city}
  }

  setEventDuration(event: EventI) {
    event.duration = this.dateMeasure(new Date(event.endDate).getTime() - new Date(event.startDate).getTime());
  }

  sortData(dict: DicDayEventI) {

    const items: DayEventI[] = Object.keys(dict).map((key) => {
      return dict[key];
    });

    items.forEach((dayEvent: DayEventI) => {
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

  handleEvent(event: EventI) {
    this.props.openModal(event);
  }

  getEventsDays() {

    const events = this.formatEventsData();

    return events.map((dayEvents: DayEventI, i) => {
        
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
                      {
                        this.props.component === 'All events' ?
                        <button className="btn sign-up" onClick={this.handleEvent.bind(this, event)}>Sign up</button>
                        :
                        <button className="btn sign-down">Sign up</button>
                      }
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

  sortDays(dayEvents: DayEventI[]) {
    return dayEvents.sort((a, b) => (a.full_date > b.full_date) ? 1 : ((b.full_date > a.full_date) ? -1 : 0));
  }

  sortEvents(events: EventI[]) {
    return events.sort((a, b) => (a.startDate > b.startDate) ? 1 : ((b.startDate > a.startDate) ? -1 : 0));
  }


  render() {

    return (

      <div className="container">
        { this.getEventsDays() }
      </div>

    );

  }

}

export default FormattedEvents;