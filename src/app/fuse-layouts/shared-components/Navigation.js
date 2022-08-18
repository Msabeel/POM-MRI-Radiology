import FuseNavigation from '@fuse/core/FuseNavigation';
import clsx from 'clsx';
import React,{useEffect} from 'react';
import { selectNavigation } from 'app/store/fuse/navigationSlice';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserSettings } from 'app/auth/store/userSlice';
import { setInitialSettings, setDefaultSettings } from 'app/store/fuse/settingsSlice';


function Navigation(props) {
   const dispatch = useDispatch();
	useEffect(()=>{
		if(localStorage.getItem('user_setting')!==undefined){
       let userData = JSON.parse(localStorage.getItem('user_setting')) 
			dispatch(setDefaultSettings(userData));
		}
	
	},[])

	const navigation = useSelector(selectNavigation);

	return (
		<FuseNavigation
			className={clsx('navigation', props.className)}
			navigation={navigation}
			layout={props.layout}
			dense={props.dense}
			active={props.active}
		/>
	);
}

Navigation.defaultProps = {
	layout: 'vertical'
};

export default React.memo(Navigation);
