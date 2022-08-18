import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Icon from '@material-ui/core/Icon';
import Input from '@material-ui/core/Input';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import React, {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Toolbar from '@material-ui/core/Toolbar';
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import FuseScrollbars from '@fuse/core/FuseScrollbars';
import CircularStatic from 'app/fuse-layouts/shared-components/loader';

import {
	addNote,
} from '../../contacts/store/contactsSlice';
const useStyles = makeStyles({

	closeIcon: {
		position: 'absolute',
		top: '0%',
		right: ' 0%',
		color: '#fff'
	},
});
function ViewNotes(props) {
	const classes = useStyles();
	const [post, setPost] = React.useState([]);
	const [note, setNote] = React.useState('');
	const [loadCount, setLoadCount] = React.useState(5);
	const [loading, setLoading] = React.useState(false);
	const [noteLoading, setNoteLoading] = React.useState(false);
	const [addNoteLoading, setAddNoteLoading] = React.useState(false);
	const dispatch = useDispatch();
	const divRef = useRef(null)
	useEffect(() => {
		if (props.exam_id) {
			getNotes(props.exam_id);
		}
	}, [props.exam]);

	useEffect(() => {
		if (divRef && divRef.current) {
			divRef.current.scrollIntoView(
				{
					behavior: 'smooth',
					block: 'end',
					inline: 'nearest'
				})
		}
	}, [loadCount])
	async function getNotes(exam_id) {
		if (!props.isGrid) {
			setLoading(true);
			const req = {
				"key": "get",
				"exam_id": exam_id
			};
			const result = await dispatch(addNote(req));
			setPost(result.payload.data);
			setLoading(false);
		} else {
			setNoteLoading(true);
			const req = {
				"key": "get",
				"exam_id": exam_id
			};
			const result = await dispatch(addNote(req));
			setPost(result.payload.data);
			setNoteLoading(false);
		}
	}
	async function handleAddNote(event) {
		if (note !== '') {

			setAddNoteLoading(true);
			const req = {
				"key": "save",
				"exam_id": props.exam_id,
				"notes": [note]

			};
			const result = await dispatch(addNote(req));
			await getNotes(props.exam_id);
			setNote('');
			setAddNoteLoading(false);



		}
	}

	function handleChangeNote(event, index) {
		const str = event.target.value;
		setNote(str);
	}

	if (loading) {
		return (
			<div className="card-footer flex flex-column p-16">
			<CircularStatic />
			</div>
		);
	}
	const onCloseNotes = () => {
		props.closeNotes()
	}

	return (
		!props.isGrid ?
			<AppBar
				className="card-footer flex flex-column p-16"
				position="static"
				color="default"
				elevation={0}
			>
				<div className="flex flex-auto -mx-4" style={{borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 10, marginBottom: 10}}>
					<Avatar className="mx-4" src="assets/images/avatars/profile.jpg" />
					<div className="flex-1 mx-4">
						<Paper elevation={0} className="w-full mb-16">
							<Input
								className="p-8 w-full border-1"
								classes={{root: 'text-13'}}
								placeholder="Add a note.."
								id="note"
								name="note"
								value={note}
								multiline
								onChange={(e) => handleChangeNote(e)}
								rows="6"
								margin="none"
								disableUnderline
							/>
						</Paper>
						<Button
							className="normal-case"
							variant="contained"
							color="primary"
							size="small"
							onClick={(e) => handleAddNote(e)}
							disabled={addNoteLoading}
						>
							Add Note
							{addNoteLoading && <CircularProgress className="ml-10" size={18} />}
						</Button>
					</div>
				</div>

				<div
					style={{
						maxHeight: '650px',
						overflow: 'scroll',
						scrollbarWidth: '1px'
					}}>

					{post && post.length > 0 && (
						<div className="">
							<div className="flex items-center">
								<Typography>{post.length} notes</Typography>
								<Icon className="text-16 mx-4" color="action">
									keyboard_arrow_down
								</Icon>
							</div>

							<List>
								{post.slice(0, loadCount).map(comment => (
									<div key={comment.id}>
										<ListItem className="px-0 -mx-8">
											<Avatar
												// alt={comment.user.name}
												// src={comment.user.avatar}
												className="mx-8"
											/>
											<ListItemText
												className="px-4"
												primary={
													<div className="flex">
														<Typography
															className="font-medium"
															color="initial"
															paragraph={false}
														>
															{`${comment.tran_user ? comment.tran_user.displayname : comment.uploadedy_user ? comment.uploadedy_user.lastname + ', ' + comment.uploadedy_user.firstname : ''}`}
														</Typography>
														<Typography className="mx-4" variant="caption">
															{comment.curr_date}
														</Typography>
													</div>
												}
												secondary={comment.notes}
											/>
										</ListItem>
										{/* <div className="flex items-center mx-52 mb-8">
										<Button className="normal-case">Reply</Button>
										<Icon className="text-14 mx-8 cursor-pointer">flag</Icon>
									</div> */}
									</div>
								))}
								<div ref={divRef}></div>

								{
									post && post.length > loadCount &&

									<div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
										<Button color="primary"
											style={{
												justifyContent: 'flex-end'
											}}
											onClick={() => {
												setLoadCount(loadCount + 5)
											}}
										>Load more</Button>
									</div>
								}
							</List>
						</div>
					)}

				</div>
			</AppBar>
			:
			<Dialog
				classes={{
					paper: 'm-24 rounded-8'
				}}
				onClose={onCloseNotes}
				open={props.isNotesOpen}
				fullWidth
				maxWidth="md"
			// fullWidth
			>
				<AppBar position="static" elevation={1}>
					<Toolbar className="flex w-full">
						<Typography variant="subtitle1" color="inherit">
							Acc# {props.access_no}
						</Typography>
						<IconButton onClick={onCloseNotes} className={classes.closeIcon} >
							<CancelIcon />
						</IconButton>
					</Toolbar>
				</AppBar>
				{
					noteLoading ?
						<div className="card-footer flex flex-column p-16">
							<CircularStatic />
						</div> :

						<DialogContent>
							{/* <FuseScrollbars> */}
							<div>
								<div className="flex flex-auto -mx-4" style={{borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 10, marginBottom: 10}}>
									<Avatar className="mx-4" src="assets/images/avatars/profile.jpg" />
									<div className="flex-1 mx-4">
										<Paper elevation={0} className="w-full mb-16">
											<Input
												className="p-8 w-full border-1"
												classes={{root: 'text-13'}}
												placeholder="Add a note.."
												id="note"
												name="note"
												value={note}
												multiline
												onChange={(e) => handleChangeNote(e)}
												rows="6"
												margin="none"
												disableUnderline
											/>
										</Paper>
										<Button
											className="normal-case"
											variant="contained"
											color="primary"
											size="small"
											onClick={(e) => handleAddNote(e)}
											disabled={addNoteLoading}
										>
											Add Note
											{addNoteLoading && <CircularProgress className="ml-10" size={18} />}
										</Button>
									</div>
								</div>

								<div
									style={{
										maxHeight: '650px',
										overflow: 'scroll',
										scrollbarWidth: '1px'
									}}>

									{post && post.length > 0 && (
										<div className="">
											<div className="flex items-center">
												<Typography>{post.length} notes</Typography>
												<Icon className="text-16 mx-4" color="action">
													keyboard_arrow_down
												</Icon>
											</div>

											<List>
												{post.slice(0, loadCount).map(comment => (
													<div key={comment.id}>
														<ListItem className="px-0 -mx-8">
															<Avatar
																// alt={comment.user.name}
																// src={comment.user.avatar}
																className="mx-8"
															/>
															<ListItemText
																className="px-4"
																primary={
																	<div className="flex">
																		<Typography
																			className="font-medium"
																			color="initial"
																			paragraph={false}
																		>
																			{`${comment.tran_user ? comment.tran_user.displayname : comment.uploadedy_user ? comment.uploadedy_user.lastname + ', ' + comment.uploadedy_user.firstname : ''}`}
																		</Typography>
																		<Typography className="mx-4" variant="caption">
																			{comment.curr_date}
																		</Typography>
																	</div>
																}
																secondary={comment.notes}
															/>
														</ListItem>
														{/* <div className="flex items-center mx-52 mb-8">
										<Button className="normal-case">Reply</Button>
										<Icon className="text-14 mx-8 cursor-pointer">flag</Icon>
									</div> */}
													</div>
												))}
												<div ref={divRef}></div>

												{
													post && post.length > loadCount &&

													<div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
														<Button color="primary"
															style={{
																justifyContent: 'flex-end'
															}}
															onClick={() => {
																setLoadCount(loadCount + 5)
															}}
														>Load more</Button>
													</div>
												}
											</List>
										</div>
									)}

								</div>
							</div>
							{/* </FuseScrollbars> */}
						</DialogContent>
				}
			</Dialog>

	);
}
export default ViewNotes;
