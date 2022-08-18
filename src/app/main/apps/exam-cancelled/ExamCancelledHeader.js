import React from 'react';
import {useParams, Link, useLocation} from 'react-router-dom';
import {useSelector} from 'react-redux';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import FuseAnimate from '@fuse/core/FuseAnimate';
import Button from '@material-ui/core/Button';

function ExamCancelledHeader(props) {

	const {name,patient_id} = useParams();
	const {selectedExamCard} = useSelector(({examCancelledApp}) => examCancelledApp.examCancelled);
	const location = useLocation();
	const {pathname} = location;
	const p_id = selectedExamCard && selectedExamCard.patient_data && selectedExamCard.patient_data.patient_id
	return (
		<div className="flex flex-1 items-center justify-between p-8 sm:p-24">
			<div className="flex flex-shrink items-center sm:w-512">
				<div className="flex items-center">
					<FuseAnimate animation="transition.expandIn" delay={300}>
						<Icon className="text-32">account_box</Icon>
					</FuseAnimate>
					<FuseAnimate animation="transition.slideLeftIn" delay={300}>
						<Typography variant="h6" className="mx-16 hidden sm:flex" >
							Patient {name}
						</Typography>
					</FuseAnimate>
					<FuseAnimate animation="transition.slideLeftIn" delay={300}>
						<Typography variant="h6" className="mx-16 hidden sm:flex" >
							{p_id}
						</Typography>
					</FuseAnimate>


				</div>
			</div>
			<div className="flex items-center justify-end">
				<Button to={`/apps/profile/${patient_id}/${name}/0`} component={Link} className="mx-8 normal-case" variant="contained" color="secondary" aria-label="Follow">
					Back
				</Button>
			</div>
		</div>
	);
}

export default ExamCancelledHeader;
