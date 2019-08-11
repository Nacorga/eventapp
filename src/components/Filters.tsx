import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import '../styles/Filters.scss';
import { FormControl, InputLabel, Select, Button, MenuItem } from '@material-ui/core';

interface FilterPropsI {
    textFilter: (textF: {type: string, status: boolean, value: string}) => void,
    startHour: (hourF: {type: string, status: boolean, value: number}) => void,
    showFreeEvents: (freeF: {type: string, status: boolean}) => void
}

interface FilterStateI {
    textF: {type: string, status: boolean, value: string};
    hourF: {type: string, status: boolean, value: number};
    freeF: {type: string, status: boolean}
}

class Filters extends Component<FilterPropsI> {

    state: FilterStateI = {
        textF: {type: 'text', status: false, value: ''},
        hourF: {type: 'hour', status: false, value: 0},
        freeF: {type: 'free', status: false}
    }

    constructor(props: any) {

        super(props);

        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.handleButton = this.handleButton.bind(this);

    }

    handleChangeName(event: React.ChangeEvent<HTMLInputElement>) {

        event.persist();

        let status: boolean;

        event.target.value !== '' ? status = true : status = false;

        this.setState((prevState: any) =>
            ( {textF: {...prevState.textF, status, value: event.target!.value} } ),
            () => {
                this.props.textFilter(this.state.textF)
            });

    }

    handleChangeSelect(event: React.ChangeEvent<{ name?: string; value: unknown }>) {

        let status: boolean;

        event.target.value !== 0 ? status = true : status = false;

        this.setState((prevState: any) =>
            ( {hourF: {...prevState.hourF, status, value: event.target.value} } ),
            () => {this.props.startHour(this.state.hourF)});

    }

    handleButton() {

        this.setState((prevState: any) =>
            ( {freeF: {...prevState.freeF, status: this.state.freeF.status = !this.state.freeF.status} } ),
            () => {this.props.showFreeEvents(this.state.freeF)});

    }

    render() {

        return(
            <div className="filters-box" >
                <div className="filters-row">
                    
                    <TextField
                        id="standard-name"
                        label="Name"
                        className="tf-name"
                        value={this.state.textF.value}
                        onChange={this.handleChangeName.bind(this)}
                        margin="normal">
                    </TextField>

                    <FormControl className="fc-select-time">
                        <InputLabel htmlFor="age-simple">Start hour</InputLabel>
                        <Select
                            value={this.state.hourF.value}
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
                        !this.state.freeF.status ?
                        <Button variant="contained" className="btn btn-free" onClick={this.handleButton}>Show free events</Button>
                        :
                        <Button variant="contained" className="btn btn-all" onClick={this.handleButton}>Show all events</Button>
                    }

                </div>
            </div>
        )

    }

}

export default Filters;
