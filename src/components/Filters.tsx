import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import '../styles/Filters.scss';
import { FormControl, InputLabel, Select, Button, MenuItem } from '@material-ui/core';

interface FilterPropsI {
    startHour: (hour: number) => void,
    showFreeEvents: (status: boolean) => void
}

interface FilterStateI {
    nameFilter: string;
    filterValue?: number;
    freeEventsFilter: boolean
}

class Filters extends Component<FilterPropsI> {

    state: FilterStateI = {
        nameFilter: '',
        filterValue: 0,
        freeEventsFilter: false
    }

    constructor(props: any) {

        super(props);

        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.handleButton = this.handleButton.bind(this);

    }

    handleChangeName() {

    }

    handleChangeSelect(event: React.ChangeEvent<{ name?: string; value: unknown }>) {
        this.setState({filterValue: event.target.value});
        this.props.startHour(event.target.value as number);
    }

    handleButton() {
        const toggleFilter = this.state.freeEventsFilter = !this.state.freeEventsFilter;
        this.setState({ freeEventsFilter: toggleFilter})
        this.props.showFreeEvents(toggleFilter);
    }

    render() {

        return(
            <form className="filters-form" noValidate autoComplete="off">

                <TextField
                    id="standard-name"
                    label="Name"
                    className="tf-name"
                    // value={values.name}
                    onChange={this.handleChangeName.bind(this)}
                    margin="normal">
                </TextField>

                <FormControl className="fc-select-time">
                    <InputLabel htmlFor="age-simple">Start hour</InputLabel>
                    <Select
                        value={this.state.filterValue}
                        onChange={this.handleChangeSelect.bind(this)}
                        inputProps={{
                            name: 'start-hour',
                            id: 'start-hour'
                        }}
                        >
                        <MenuItem value={0}>Show all</MenuItem>
                        <MenuItem value={1}>Morning (6am - 12 pm)</MenuItem>
                        <MenuItem value={2}>Afternoon (12pm - 17pm)</MenuItem>
                        <MenuItem value={3}>Evening (17pm - 21pm)</MenuItem>
                        <MenuItem value={4}>Night (21pm - 6am)</MenuItem>
                    </Select>
                </FormControl>
                
                {
                    !this.state.freeEventsFilter ?
                    <Button variant="contained" className="btn btn-free" onClick={this.handleButton}>Show free events</Button>
                    :
                    <Button variant="contained" className="btn btn-all" onClick={this.handleButton}>Show all events</Button>
                }

            </form>
        )

    }

}

export default Filters;
