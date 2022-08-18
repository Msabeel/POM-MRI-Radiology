import React, { useState, useEffect } from 'react';
import Popover from '@material-ui/core/Popover';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

function RefPopover(props) {
	return (
		<Popover
			id="refPopover"
			open={props.open}
			anchorEl={props.anchorEl}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'left',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'left',
			}}
			onClose={props.refMenuClose}
			classes={{
				paper: 'py-8 rounded-2xl'
			}}
		>
			<Box p={2}>
				<div className="flex">
					<Typography className="font-medium text-13 italic mr-6">Name:</Typography>
					<Typography className="font-700 text-15">{props.refPopover.displayname}</Typography>
				</div>
				<div className="flex">
					<Typography className="font-medium text-13 italic mr-6">Address:</Typography>
					<Typography className="font-700 text-15">{props.refPopover.address_line1}</Typography>
				</div>
				<div className="flex">
					<Typography className="font-medium text-13 italic mr-6">Phone:</Typography>
					<Typography className="font-700 text-15">{props.refPopover.phone}</Typography>
				</div>
			</Box>
		</Popover>
	);
}

export default RefPopover;
