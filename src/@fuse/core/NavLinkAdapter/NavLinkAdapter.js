import React from 'react';
import {NavLink, Route} from 'react-router-dom';
import Icon from '@material-ui/core/Icon';
import ListItemText from '@material-ui/core/ListItemText';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {CustomSettings} from 'app/config';

const useStyles = makeStyles(theme => ({
    item: props => ({
        height: 40,
        width: 'calc(100% - 16px)',
        borderRadius: '0 20px 20px 0',
        paddingRight: 12,
        paddingLeft: props.itemPadding > 80 ? 80 : props.itemPadding,
        '&.active': {
            backgroundColor: theme.palette.secondary.main,
            color: `${theme.palette.secondary.contrastText}!important`,
            pointerEvents: 'none',
            transition: 'border-radius .15s cubic-bezier(0.4,0.0,0.2,1)',
            '& .list-item-text-primary': {
                color: 'inherit'
            },
            '& .list-item-icon': {
                color: 'inherit'
            }
        },
        '& .list-item-icon': {
            marginRight: 16
        },
        '& .list-item-text': {},
        color: theme.palette.text.primary,
        cursor: 'pointer',
        textDecoration: 'none!important'
    })
}));

const NavLinkAdapter = React.forwardRef((props, ref) => {
    const theme = useTheme();
    const classes = useStyles({
        itemPadding: props.nestedLevel > 0 ? 40 + props.nestedLevel * 16 : 24
    });
    const IndexSettings = JSON.parse(localStorage.getItem('Index_Details'));
    const userdata = JSON.parse(localStorage.getItem('USER'));
    let BaseUrl = CustomSettings.BackURL;
    if (IndexSettings.redirectUrl && IndexSettings.redirectUrl.FinishedURL !== null) {
        BaseUrl = IndexSettings.redirectUrl.FinishedURL.replace('/home', '');
    }
    if (props.isredirect === true) {
        let rendom = new Date().getTime();
        return (
            <a
                className={props.className}
                style={{backgroundColor:'transparent'}}
                activeClassName={props.activeClassName}
                href={userdata && userdata.data && props.title==='Pacs'?`http://import.pomrispacs.com:9090/?un=${userdata.data.userName}&userid=${userdata.data.userId}&token=`+rendom:BaseUrl + props.url}
                target={props.title==="Pacs"?'_blank' :'_self'}
                >
                {/* {!props.icon && (
                    <Icon className="list-item-icon text-16 flex-shrink-0" color="action">
                        {props.icon}
                    </Icon>
                )} */}
                <ListItemText
                    style={{color: '#fff'}}
                    className="list-item-text"
                    primary={props.translate ? props.t(props.translate) : props.title}
                    classes={{primary: 'text-14 list-item-text-primary'}}
                />

            </a>
            // <NavLink
            //     component={props.NavLinkAdapter}
            //     className={props.className}
            //     activeClassName={props.activeClassName}
            //     exact={props.exact}
            //     to={{pathname: "https://google.com"}} target="_blank">
            //  	{props.icon && (

            // )}

            // <ListItemText
            // 	className="list-item-text"
            // 	primary={props.translate ? props.t(props.translate) : props.title}
            // 	classes={{primary: 'text-14 list-item-text-primary'}}
            // />

            // </NavLink>
            // <NavLink innerRef={ref}
            //     to={{ pathname: "http://www.google.com"}}
            //     component={props.NavLinkAdapter}
            //     activeClassName={props.activeClassName}
            //     className={props.className}
            //     onClick={props.onClick}
            //     exact={props.exact}
            // />
        )
    } else {
        return (
            <NavLink innerRef={ref} {...props} />
        )
    }
});

export default NavLinkAdapter;
