import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';


function AboutTab(props) {
	const [data, setData] = useState(null);
	useEffect(() => {
		axios.get('/api/profile/about').then(res => {
			setData(res.data);
		});
	}, []);

	if (!data) {
		return null;
	}

	if (props.patientInfo==null) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<CircularProgress></CircularProgress>
			</div>
		);
	}

	const { general, work, contact, groups, friends } = data;
	if (Object.keys(props.patientInfo).length===0) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Typography color="textSecondary" variant="h5">
					User Info not found!
				</Typography>
			</div>
		);
	}


	
	return (
		<div className="md:flex max-w-2xl">
			<div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
				<FuseAnimateGroup
					enter={{
						animation: 'transition.slideUpBigIn'
					}}
				>
					<Card className="w-full mb-16 rounded-8">
						<AppBar position="static" elevation={0}>
							<Toolbar className="px-8">
								<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
									General Information
								</Typography>
							</Toolbar>
						</AppBar>

						<CardContent>
							<div className="mb-24">
								<Typography className="font-bold mb-4 text-15">Gender</Typography>
								<Typography>{props.patientInfo.gender}</Typography>
							</div>

							<div className="mb-24">
								<Typography className="font-bold mb-4 text-15">Birthday</Typography>
								<Typography>{props.patientInfo.dob}</Typography>
							</div>

							<div className="mb-24">
								<Typography className="font-bold mb-4 text-15">Locations</Typography>

								{/* {general.locations.map(location => ( */}
									<div className="flex items-center" key={props.patientInfo.country_name}>
										<Typography>{`${props.patientInfo.country_name}, ${props.patientInfo.state_name}`}</Typography>
										<Icon className="text-16 mx-4" color="action">
											location_on
										</Icon>
									</div>
								{/* ))} */}
							</div>

							{/* <div className="mb-24">
								<Typography className="font-bold mb-4 text-15">About Me</Typography>
								<Typography>{general.about}</Typography>
							</div> */}
						</CardContent>
					</Card>

					<Card className="w-full mb-16 rounded-8">
						<AppBar position="static" elevation={0}>
							<Toolbar className="px-8">
								<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
									Work
								</Typography>
							</Toolbar>
						</AppBar>

						<CardContent>
							<div className="mb-24">
								<Typography className="font-bold mb-4 text-15">Occupation</Typography>
								<Typography>{work.occupation}</Typography>
							</div>

							<div className="mb-24">
								<Typography className="font-bold mb-4 text-15">Skills</Typography>
								<Typography>{work.skills}</Typography>
							</div>

							<div className="mb-24">
								<Typography className="font-bold mb-4 text-15">Jobs</Typography>
								<table className="">
									<tbody>
										{work.jobs.map(job => (
											<tr key={job.company}>
												<td>
													<Typography>{job.company}</Typography>
												</td>
												<td className="px-16">
													<Typography color="textSecondary">{job.date}</Typography>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</CardContent>
					</Card>

					<Card className="w-full mb-16 rounded-8">
						<AppBar position="static" elevation={0}>
							<Toolbar className="px-8">
								<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
									Contact
								</Typography>
							</Toolbar>
						</AppBar>

						<CardContent>
							<div className="mb-24">
								<Typography className="font-bold mb-4 text-15">Address</Typography>
								<Typography>{props.patientInfo.address1}</Typography>
								<Typography>{props.patientInfo.address2}</Typography>

							</div>
							

							<div className="mb-24">
								<Typography className="font-bold mb-4 text-15">Tel.</Typography>

								{/* {contact.tel.map(tel => ( */}
									<div className="flex items-center" key={props.patientInfo.mobile}>
									<Typography>{props.patientInfo.mobile}</Typography>
									</div>
									<div className="flex items-center" key={props.patientInfo.phone_home}>
									<Typography>{props.patientInfo.phone_home}</Typography>
								    </div>
									<div className="flex items-center" key={props.patientInfo.phone_alt}>
									<Typography>{props.patientInfo.phone_alt}</Typography>
								    </div>
								{/* ))} */}
							</div>

							<div className="mb-24">
								<Typography className="font-bold mb-4 text-15">Preferred Contact Mode</Typography>

								{/* {contact.websites.map(website => ( */}
									<div className="flex items-center" key={props.patientInfo.preferred_contact_mode}>
										<Typography>{props.patientInfo.preferred_contact_mode}</Typography>
									</div>
								{/* ))} */}
							</div>

							<div className="mb-24">
								<Typography className="font-bold mb-4 text-15">Emails</Typography>

								{/* {contact.emails.map(email => ( */}
									<div className="flex items-center" key={props.patientInfo.email}>
										<Typography>{props.patientInfo.email}</Typography>
									</div>
								{/* ))} */}
							</div>
						</CardContent>
					</Card>
				</FuseAnimateGroup>
			</div>

			<div className="flex flex-col md:w-320">
				<FuseAnimateGroup
					enter={{
						animation: 'transition.slideUpBigIn'
					}}
				>
					{/* <Card className="w-full mb-16 rounded-8">
						<AppBar position="static" elevation={0}>
							<Toolbar className="px-8">
								<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
								Family & friends
								</Typography>
								<Button className="normal-case" color="inherit" size="small">
									See 454 more
								</Button>
							</Toolbar>
						</AppBar>
						<CardContent className="flex flex-wrap p-8">
							{friends.map(friend => (
								<img
									key={friend.id}
									className="w-64 m-4 rounded-4 block"
									src={friend.avatar}
									alt={friend.name}
								/>
							))}
						</CardContent>
					</Card> */}

                       <Card className="w-full mb-16 rounded-8">
						<AppBar position="static" elevation={0}>
							<Toolbar className="px-8">
								<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
								Family & friends
								</Typography>
								{/* <Button className="normal-case" color="inherit" size="small">
									See 6 more
								</Button> */}
							</Toolbar>
						</AppBar>
						<CardContent className="p-0">
							<List className="p-0">
								{props.familysData.length>0&&props.familysData.map(family => (
									<ListItem key={family.id} className="px-8">
										<Avatar className="mx-8" alt={family.fname}>
                                          A
										</Avatar>
										<ListItemText
											primary={
												<div className="flex">
													<Typography
														className="font-medium"
														color="secondary"
														paragraph={false}
													>
														{family.lname}
													</Typography>

													<Typography className="mx-4" paragraph={false}>
														{family.lname}
													</Typography>
													{/* <Typography className="mx-4" paragraph={false}>
														{family.mobile}
													</Typography> */}
												</div>
											}
											secondary={`${family.mobile}`} 
								
                                                  />
										<ListItemSecondaryAction>
											<IconButton>
												<Icon>more_vert</Icon>
											</IconButton>
										</ListItemSecondaryAction>
									</ListItem>
								))}
							</List>
						</CardContent>
					</Card>
					<Card className="w-full mb-16 rounded-8">
						<AppBar position="static" elevation={0}>
							<Toolbar className="px-8">
								<Typography variant="subtitle1" color="inherit" className="flex-1 px-12">
							    Recent Exams
								</Typography>
								{/* <Button className="normal-case" color="inherit" size="small">
									See 6 more
								</Button> */}
							</Toolbar>
						</AppBar>
						<CardContent className="p-0">
							<List className="p-0">
								{props.exams.length>0&&props.exams.map(exam => (
									<ListItem key={exam.id} className="px-8">
										<Avatar className="mx-8" alt={exam.name}>
                                          A
										</Avatar>
										<ListItemText
											primary={
												<div className="flex">
													<Typography
														className="font-medium"
														color="secondary"
														paragraph={false}
													>
														{exam.scheduling_date}
													</Typography>

													<Typography className="mx-4" paragraph={false}>
														{exam.location}
													</Typography>
													<Typography className="mx-4" paragraph={false}>
														{exam.modality}
													</Typography>
												</div>
											}
											secondary={`${exam.exam} ${exam.acc_number}`} 
								
                                                  />
										<ListItemSecondaryAction>
											<IconButton>
												<Icon>more_vert</Icon>
											</IconButton>
										</ListItemSecondaryAction>
									</ListItem>
								))}
							</List>
						</CardContent>
					</Card>
				</FuseAnimateGroup>
			</div>
		</div>
	);
}

export default AboutTab;
