import React, {useEffect, useState} from 'react';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {useSelector, useDispatch} from 'react-redux';
import {getAllModality} from './store/QuickSchSlice';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {green} from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
    listItem: {
        color: 'inherit!important',
        textDecoration: 'none!important',
        height: 40,
        width: 'calc(100% - 16px)',
        borderRadius: '0 20px 20px 0',
        paddingLeft: 24,
        paddingRight: 12,
        '&.active': {
            backgroundColor: theme.palette.secondary.main,
            color: `${theme.palette.secondary.contrastText}!important`,
            pointerEvents: 'none',
            '& .list-item-icon': {
                color: 'inherit'
            }
        },
        '& .list-item-icon': {
            marginRight: 16
        }
    }
}));
const flexContainer = {
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
};
const GreenCheckbox = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);

function QuickSchContent(props) {
    const distpath = useDispatch();
    const [locations, setLocations] = useState([])
    const [modalities, setModalities] = useState([])
    const [selected, setSelected] = useState([])

    useEffect(() => {
        const fetchModality = async () => {
            const result = await distpath(getAllModality());
            if (result.payload.data) {
                const tempLocation = [];
                result.payload.data.map((item, index) => {
                    const loca = {
                        locationid: item.locationid,
                        locationName: item.locationName
                    }
                    let tempIndex = tempLocation.find(x => x.locationName === item.locationName);
                    if (tempIndex === undefined) {
                        tempLocation.push(loca);
                    }

                    return 0;
                })
                setLocations(tempLocation)
                setModalities(result.payload.data)
            } else {
            }
        }
        fetchModality();
    }, [])

    const handleCheckMod = (e, mod) => {
        let tempSelected = JSON.parse(JSON.stringify(selected))
        let index = tempSelected.filter(x => x.id === mod.id)
        if (index === -1) {
            tempSelected.push(mod)
        } else {
            tempSelected = tempSelected.filter(x => x.id !== mod.id);
        }
        setSelected(tempSelected)
    }

    const classes = useStyles(props);
    return (
        <div className="p-0 lg:p-24 lg:ltr:pr-4 lg:rtl:pl-4">
            {/* <FuseAnimate animation="transition.slideLeftIn" delay={200}> */}
            {/* <Divider /> */}

            {locations.map((item, index) => {
                return (

                    <Container key={index} style={{width: '100%', padding: 15, marginBottom: 25, backgroundColor: '#fff'}}>
                        <Grid container spacing={3} style={{width: '100%', padding: 15}}>
                            <Grid item sm={3}>
                                <h3 style={{fontWeight: '700', fontSize: 20}}>{item.locationName} Modalities</h3>
                            </Grid>
                            <Grid item sm={9}>
                                <div style={{width: '100%', display: 'flex'}}>
                                    <Grid container spacing={3} >
                                        {
                                            modalities.map((mod, modIndex) => {
                                                if (mod.locationid == item.locationid) {
                                                    let isCheck = false;
                                                    let filterCheck = selected.filter(x => x.id === mod.id);
                                                    console.log("filterCheck", filterCheck)
                                                    if (filterCheck.length > 0) {
                                                        isCheck = true;
                                                    }
                                                    return (
                                                        <FormControlLabel
                                                            key={modIndex}
                                                            control={
                                                                <GreenCheckbox
                                                                    checked={isCheck}
                                                                    onChange={(e) => handleCheckMod(e, mod)}
                                                                />
                                                            }
                                                            label={mod.modality}
                                                            style={{marginLeft: 10}}
                                                        />
                                                    )
                                                } else {
                                                    return null
                                                }

                                            })
                                        }
                                    </Grid>
                                </div>
                            </Grid>
                        </Grid>
                    </Container>

                )
            })}
            {/* <List style={flexContainer}>
						<ListItem
							button
							component={NavLinkAdapter}
							to="/apps/contacts/all"
							activeClassName="active"
							className={classes.listItem}
						>
							<Icon className="list-item-icon text-16" color="action">
								people
							</Icon>
							<ListItemText className="truncate" primary="Recent Patients" disableTypography />
						</ListItem>
						<ListItem
							button
							component={NavLinkAdapter}
							to="/apps/contacts/frequent"
							activeClassName="active"
							className={classes.listItem}
						>
							<Icon className="list-item-icon text-16" color="action">
								restore
							</Icon>
							<ListItemText className="truncate" primary="Starred Patients" disableTypography />
						</ListItem>
						
					</List>
		 */}

            {/* </FuseAnimate> */}
        </div>
    );
}

export default QuickSchContent;
