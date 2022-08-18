import FuseAnimate from '@fuse/core/FuseAnimate';
import Typography from '@material-ui/core/Typography';

import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import Hidden from '@material-ui/core/Hidden';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {ThemeProvider} from '@material-ui/core/styles';
import DateRangeIcon from '@material-ui/icons/DateRange';
function QuickSchHeader(props) {
    const dispatch = useDispatch();



    return (
        <div className="flex flex-1 items-center justify-between p-8 sm:p-24">
            <div className="flex flex-shrink items-center sm:w-224">
                <Hidden lgUp>
                    <IconButton
                        onClick={ev => {
                            props.pageLayout.current.toggleLeftSidebar();
                        }}
                        aria-label="open left sidebar"
                    >
                        <Icon>menu</Icon>
                    </IconButton>
                </Hidden>

                <div className="flex items-center">
                    <FuseAnimate animation="transition.expandIn" delay={300}>
                        <DateRangeIcon className="text-32" />
                    </FuseAnimate>
                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                        <Typography variant="h6" className="mx-12 hidden sm:flex">
                            Quick Schedule
                        </Typography>
                    </FuseAnimate>
                </div>
            </div>

            <div className="flex flex-1 items-center justify-between px-8 sm:px-12 rs-top-filter">
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        {/* <ThemeProvider theme={mainTheme}>
                            <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                <Paper
                                    className="flex p-4 items-center w-full max-w-512 h-40 px-8 py-4 rounded-8"
                                    elevation={1}
                                >
                                    <Icon color="action">search</Icon>
                                    <Searchbar  />
                                </Paper>
                            </FuseAnimate>
                        </ThemeProvider> */}
                    </Grid>

                    {/* {(filterOptions.length > 0) ?
                        <Grid item xs={12} className="py-0">
                            <div className="filter-item-container">
                                {filterOptions.map((option, index) => (
                                    <div className="filter-item" key={index + '-' + Math.floor(Math.random() * 100)}>
                                        {(index > 0) ? <select className="filter-operator" value={whereOperator} onChange={(e) => setWhereOperator(e.target.value)} >
                                            <option value="AND">AND</option>
                                            <option value="OR">OR</option>
                                        </select> : null}
                                        <Button className="filter-content" variant="outlined">
                                            {(option.value !== 'keyword') ? (<b>{option.title}:</b>) : null}&nbsp; {option.showMatch || option.match}
                                            <span style={{marginLeft: '5px'}} onClick={() => removeFilterOption(index)} >
                                                <ClearIcon />
                                            </span>
                                        </Button>
                                    </div>
                                ))}
                                {(filterOptions.length > 0) ? <div className="filter-button"><Button className="clear-filter" variant="outlined" onClick={() => dispatch(clearFilterOptions(''))}>Clear Filters</Button></div> : null}
                            </div>
                        </Grid> : null} */}

                </Grid>
            </div>
            {/* <PermissionSwitch permission="patient_lookup" /> */}


        </div>
    );
}


export default QuickSchHeader;
