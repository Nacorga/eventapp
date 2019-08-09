import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import '../styles/Filters.scss';
import { FormControl, InputLabel, Select, Button, MenuItem } from '@material-ui/core';

class Filters extends Component {

    handleChangeName() {

    }

    handleChangeSelect() {
        
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
                    <InputLabel htmlFor="age-simple">Age</InputLabel>
                    <Select
                        // value={values.age}
                        onChange={this.handleChangeSelect.bind(this)}
                        inputProps={{
                            name: 'age',
                            id: 'age-simple',
                        }}
                        >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>

                <Button variant="contained" className="btn-free">Free events</Button>

            </form>
        )

    }

}

export default Filters;
