import mock from '../mock';

const projectDashboardAppDB = {
	widgets: [
		{
			id: 'widget1',
			ranges: {
				DT: 'Today',
				DTM: 'Tomorrow',
				DTW: 'Next 7 Days'
			},
			currentRange: 'DT',
			data: {
				label: 'Pre Schedule Status',
				count: {
					DT: 1,
					DTM: 2,
					DTW: 3
				},
				extra: {
					label: 'View Details'
				}
			},
			detail: 'You can show some detailed information about this widget in here.'
		},
		{
			id: 'widget2',
			ranges: {
				DT: 'Today',
				DY: 'Yesterday',
				DTW: 'Last 7 Days',
				DTFM: 'Last 30 Days'
			},
			currentRange: 'DT',
			data: {
				label: 'No Show Exams',
				count: {
					DT: 1,
					DY: 2,
					DTW: 3,
					DTFM: 3
				},
				extra: {
					label: 'View Details'
				}
			},
			detail: 'You can show some detailed information about this widget in here.'
		},
		{
			id: 'widget3',
			ranges: {
				All: 'All',
				DT: 'Rad1 dynamic',
				DY: 'Rad2 dynamic',
				DTW: 'Rad13 dynamic'
			},
			currentRange: 'All',
			data: {
				label: 'Pending Interpretation',
				count: {
					All: 1,
					DT: 1,
					DY: 2,
					DTW: 3
				},
				extra: {
					label: 'View Details',
					count: {
						All: 17,
						DT: 7,
						DY: '-',
						DTW: '-'
					}
				}
			},
			detail: 'You can show some detailed information about this widget in here.'
		},
		{
			id: 'widget4',
			ranges: {
				All: 'All',
				DT: 'Tech name1',
				DY: 'Tech name2 dynamic',
				DTW: 'Tech name2 dynamic'
			},
			currentRange: 'All',
			data: {
				label: 'Tech Hold',
				count: {
					All: 1,
					DT: 1,
					DY: 2,
					DTW: 3
				},
				extra: {
					label: 'View Details',
					count: {
						All: 17,
						DT: 7,
						DY: '-',
						DTW: '-'
					}
				}
			},
			detail: 'You can show some detailed information about this widget in here.'
		},
		{
			id: 'widget5',
			chartType: 'line',
			datasets: {
				yesterday: [
					{
						label: 'Scheduled',
						data: [190, 300, 340, 220, 290, 390, 250, 380, 410, 380, 320, 290],
						fill: 'start'
					},
					{
						label: 'Completed',
						data: [2200, 2900, 3900, 2500, 3800, 3200, 2900, 1900, 3000, 3400, 4100, 3800],
						fill: 'start'
					}
				],
				today: [
					{
						label: 'Scheduled',
						data: [410, 380, 320, 290, 190, 390, 250, 380, 300, 340, 220, 290],
						fill: 'start'
					},
					{
						label: 'Completed',
						data: [3000, 3400, 4100, 3800, 2200, 3200, 2900, 1900, 2900, 3900, 2500, 3800],
						fill: 'start'
					}
				],
				next_7_days: [
					{
						label: 'Scheduled',
						data: [410, 380, 320, 290, 190, 390, 250, 380, 300, 340, 220, 290],
						fill: 'start'
					},
					{
						label: 'Completed',
						data: [3000, 3400, 4100, 3800, 2200, 3200, 2900, 1900, 2900, 3900, 2500, 3800],
						fill: 'start'
					}
				],
				lastweek: [
					{
						label: 'Scheduled',
						data: [410, 380, 320, 290, 190, 390, 250, 380, 300, 340, 220, 290],
						fill: 'start'
					},
					{
						label: 'Completed',
						data: [3000, 3400, 4100, 3800, 2200, 3200, 2900, 1900, 2900, 3900, 2500, 3800],
						fill: 'start'
					}
				]
			},
			labels: [ '10am', '12pm', '2pm', '4pm', '6pm', '8pm', '10pm'],
			options: {
				spanGaps: false,
				legend: {
					display: false
				},
				maintainAspectRatio: false,
				tooltips: {
					position: 'nearest',
					mode: 'index',
					intersect: false
				},
				layout: {
					padding: {
						left: 24,
						right: 32
					}
				},
				elements: {
					point: {
						radius: 4,
						borderWidth: 2,
						hoverRadius: 4,
						hoverBorderWidth: 2
					}
				},
				scales: {
					xAxes: [
						{
							gridLines: {
								display: false
							},
							ticks: {
								fontColor: 'rgba(0,0,0,0.54)'
							}
						}
					],
					yAxes: [
						{
							gridLines: {
								tickMarkLength: 16
							},
							ticks: {
								stepSize: 1000
							}
						}
					]
				},
				plugins: {
					filler: {
						propagate: false
					}
				}
			}
		},
		{
			id: 'widget6',
			title: 'Incoming Orders',
			ranges: {
				TW: 'This Week',
				LW: 'Last Week',
				'2W': '2 Weeks Ago'
			},
			currentRange: 'TW',
			mainChart: {
				labels: ['US', 'MR', 'CT', 'DX'],
				datasets: {
					TW: [
						{
							data: [15, 20, 38, 27],
							backgroundColor: ['#F44336', '#9C27B0', '#03A9F4', '#E91E63'],
							hoverBackgroundColor: ['#F45A4D', '#A041B0', '#25B6F4', '#E9487F']
						}
					],
					LW: [
						{
							data: [19, 16, 42, 23],
							backgroundColor: ['#F44336', '#9C27B0', '#03A9F4', '#E91E63'],
							hoverBackgroundColor: ['#F45A4D', '#A041B0', '#25B6F4', '#E9487F']
						}
					],
					'2W': [
						{
							data: [18, 17, 40, 25],
							backgroundColor: ['#F44336', '#9C27B0', '#03A9F4', '#E91E63'],
							hoverBackgroundColor: ['#F45A4D', '#A041B0', '#25B6F4', '#E9487F']
						}
					]
				},
				options: {
					cutoutPercentage: 66,
					spanGaps: false,
					legend: {
						display: true,
						position: 'bottom',
						labels: {
							padding: 16,
							usePointStyle: true
						}
					},
					maintainAspectRatio: false
				}
			},
			footerLeft: {
				title: 'Incoming Orders',
				count: {
					'2W': 487,
					LW: 526,
					TW: 594
				}
			},
			footerRight: {
				title: 'Tasks Completed',
				count: {
					'2W': 193,
					LW: 260,
					TW: 287
				}
			}
		},
		{
			id: 'widget7',
			title: 'Schedule',
			currentRange: 'T',
			ranges: {
				T: 'Today',
				TM: 'Tomorrow'
			},
			schedule: {
				T: [
					{
						id: 1,
						title: 'Group Meeting',
						time: 'In 32 minutes'
					},
					{
						id: 2,
						title: 'Coffee Break',
						time: '10:30 AM'
					},
					{
						id: 3,
						title: 'Public Beta Release',
						time: '11:00 AM'
					},
					{
						id: 4,
						title: 'Lunch',
						time: '12:10 PM'
					},
					{
						id: 5,
						title: 'Dinner with David',
						time: '17:30 PM'
					},
					{
						id: 6,
						title: "Jane's Birthday Party",
						time: '19:30 PM'
					},
					{
						id: 7,
						title: "Overseer's Retirement Party",
						time: '21:30 PM'
					}
				],
				TM: [
					{
						id: 1,
						title: 'Marketing Meeting',
						time: '09:00 AM'
					},
					{
						id: 2,
						title: 'Public Announcement',
						time: '11:00 AM'
					},
					{
						id: 3,
						title: 'Lunch',
						time: '12:10 PM'
					},
					{
						id: 4,
						title: 'Meeting with Beta Testers',
						time: '15:00 AM'
					},
					{
						id: 5,
						title: 'Live Stream',
						time: '17:30 PM'
					},
					{
						id: 6,
						title: 'Release Party',
						time: '19:30 PM'
					},
					{
						id: 7,
						title: "CEO's Party",
						time: '22:30 PM'
					}
				]
			}
		},
		
		
		{
			id: 'weatherWidget',
			locations: {
				NewYork: {
					name: 'New York',
					icon: 'rainy2',
					temp: {
						C: '22',
						F: '72'
					},
					windSpeed: {
						KMH: 12,
						MPH: 7.5
					},
					windDirection: 'NW',
					rainProbability: '98%',
					next3Days: [
						{
							name: 'Sunday',
							icon: 'rainy',
							temp: {
								C: '21',
								F: '70'
							}
						},
						{
							name: 'Monday',
							icon: 'cloudy',
							temp: {
								C: '19',
								F: '66'
							}
						},
						{
							name: 'Tuesday',
							icon: 'windy3',
							temp: {
								C: '24',
								F: '75'
							}
						}
					]
				}
			},
			currentLocation: 'NewYork',
			tempUnit: 'C',
			speedUnit: 'KMH'
		},
        {
			id: 'widget12',
			datasets: [
				[
					{
						label: '1Day',
						data: [72, 65, 70, 78, 85, 82, 88],
						fill: false,
						borderColor: '#5c84f1'
					}
				],
				[
					{
						label: '1Week',
						data: [540, 539, 527, 548, 540, 552, 566],
						fill: false,
						borderColor: '#5c84f1'
					}
				],
				[
					{
						label: '1Month',
						data: [1520, 1529, 1567, 1588, 1590, 1652, 1622],
						fill: false,
						borderColor: '#5c84f1'
					}
				]
			],
			labels: ['1', '2', '3', '4', '5', '6', '7'],
			options: {
				spanGaps: true,
				legend: {
					display: false
				},
				maintainAspectRatio: true,
				elements: {
					point: {
						radius: 2,
						borderWidth: 1,
						hoverRadius: 2,
						hoverBorderWidth: 1
					},
					line: {
						tension: 0
					}
				},
				layout: {
					padding: {
						top: 24,
						left: 16,
						right: 16,
						bottom: 16
					}
				},
				scales: {
					xAxes: [
						{
							display: false
						}
					],
					yAxes: [
						{
							display: true,
							ticks: {
								// min: 100,
								// max: 500
							}
						}
					]
				}
			},
			today: '12,540',
			change: {
				value: 321,
				percentage: 2.05
			}
		},
        {
			id: 'widget13',
			datasets: [
				[
					{
						label: '1Day',
						data: [72, 65, 70, 78, 85, 82, 88],
						fill: false,
						borderColor: '#5c84f1'
					}
				],
				[
					{
						label: '1Week',
						data: [540, 539, 527, 548, 540, 552, 566],
						fill: false,
						borderColor: '#5c84f1'
					}
				],
				[
					{
						label: '1Month',
						data: [1520, 1529, 1567, 1588, 1590, 1652, 1622],
						fill: false,
						borderColor: '#5c84f1'
					}
				]
			],
			labels: ['1', '2', '3', '4', '5', '6', '7'],
			options: {
				spanGaps: true,
				legend: {
					display: false
				},
				maintainAspectRatio: true,
				elements: {
					point: {
						radius: 2,
						borderWidth: 1,
						hoverRadius: 2,
						hoverBorderWidth: 1
					},
					line: {
						tension: 0
					}
				},
				layout: {
					padding: {
						top: 24,
						left: 16,
						right: 16,
						bottom: 16
					}
				},
				scales: {
					xAxes: [
						{
							display: false
						}
					],
					yAxes: [
						{
							display: true,
							ticks: {
								// min: 100,
								// max: 500
							}
						}
					]
				}
			},
			today: '12,540',
			change: {
				value: 321,
				percentage: 2.05
			}
		}
	],
	projects: [
		{
			id: 1,
			name: 'ACME Corp. Backend App'
		},
		{
			id: 2,
			name: 'ACME Corp. Frontend App'
		},
		{
			id: 3,
			name: 'Creapond'
		},
		{
			id: 4,
			name: 'Withinpixels'
		}
	]
};

mock.onGet('/api/project-dashboard-app/widgets').reply(config => {
    console.log(projectDashboardAppDB.widgets);
	return [200, projectDashboardAppDB.widgets];
});

mock.onGet('/api/project-dashboard-app/projects').reply(config => {
	return [200, projectDashboardAppDB.projects];
});
