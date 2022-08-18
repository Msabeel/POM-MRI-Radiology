import FuseAnimate from '@fuse/core/FuseAnimate';
import Hidden from '@material-ui/core/Hidden';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import { useParams } from 'react-router-dom';

function PaperWorkInfoHeader(props) {
	const dispatch = useDispatch();
	const mainTheme = useSelector(selectMainTheme);
	const {name} = useParams();

	return (
		<div className="flex flex-1 items-center justify-between p-8 sm:p-24">
			<div className="flex flex-shrink items-center sm:w-512">
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
						<Icon className="text-32">local_hospital</Icon>
					</FuseAnimate>
					<FuseAnimate animation="transition.slideLeftIn" delay={300}>
						<Typography  variant="h6" className="mx-16 hidden sm:flex" >
							PaperWork Info, {name}
						</Typography>
					</FuseAnimate>
				</div>
			</div>

		
		</div>
	);
}

export default PaperWorkInfoHeader;
