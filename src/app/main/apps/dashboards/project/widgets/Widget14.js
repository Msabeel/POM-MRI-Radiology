import _ from '@lodash';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import { useTheme } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import { Line } from 'react-chartjs-2';
import PermissionSwitch from 'app/fuse-layouts/shared-components/PermissionSwitch';

const options = {
	"spanGaps":false,
	"legend":{"display":false},
	"maintainAspectRatio":false,
	"tooltips":{"position":"nearest","mode":"index","intersect":false},
	"layout":{"padding":{"left":24,"right":32}},
	"elements":{"point":{"radius":4,"borderWidth":2,"hoverRadius":4,"hoverBorderWidth":2}},
	"scales":{
		"xAxes":[{"gridLines":{"display":false},"ticks":{"fontColor":"rgba(0,0,0,0.54)"}}],
		"yAxes":[{"gridLines":{"tickMarkLength":16}, "ticks":{ beginAtZero: true }}]},
		"plugins":{"filler":{"propagate":false}
	  }
};

function Widget14(props) {
	const theme = useTheme();
	const [dataset, setDataset] = useState('days');
	const [noShowData, setNoShowData] = useState({});
	const { widget } = props;
	//const data = props.data;
	// _.setWith(data, 'options.scales.xAxes[0].ticks.fontColor', theme.palette.text.secondary);
	// _.setWith(data, 'options.scales.yAxes[0].ticks.fontColor', theme.palette.text.secondary);
	// _.setWith(data, 'options.scales.yAxes[0].gridLines.color', fade(theme.palette.text.secondary, 0.1));

	useEffect(() => {
		if(widget) {
			let datas = prepareData(dataset);
			setNoShowData(datas);
		}
	}, [widget]);

	function prepareData (dataset) {
		const noShowDays = widget[dataset];
		const labels = Object.keys(noShowDays).map(key => {
			if(!noShowDays[key].label) {
				return 'Sep 2021';
			}
			return noShowDays[key].label;
		});
		const datasets = Object.keys(noShowDays).map(key => {
			return noShowDays[key].count;
		});
		const datas = {
			labels: labels.reverse(),
			datasets: [
				{
					label: 'No Show Exams This Week',
					data: datasets.reverse(),
					fill: false,
					backgroundColor: 'rgb(97, 218, 251)', //'#192d3e',
					borderColor: 'rgb(97, 218, 251)', //'#192d3e',
				},
			],
		};
		return datas;
	}
	function showData (_dataset) {
		const data = prepareData(_dataset);
		setNoShowData(data);
		setDataset(_dataset);
	}

	return (
		<Card className="w-full rounded-8 shadow-1">
			<div className="relative p-24 flex flex-row items-center justify-between">
				<div className="flex flex-col">
					<Typography className="h3 sm:h2">No Show Exams This Week</Typography>
				</div>
				<div className="flex flex-row items-center">
					<Button
						key='days'
						className="py-8 px-12"
						size="small"
						onClick={() => showData('days')}
						disabled={'days' === dataset}
					>
						Day
					</Button>
					<Button
						key='months'
						className="py-8 px-12"
						size="small"
						onClick={() => showData('months')}
						disabled={'months' === dataset}
					>
						Month
					</Button>
				</div>
			</div>

			<Typography className="relative h-200 sm:h-320 sm:pb-16">
				<Line data={noShowData} options={options} />
			</Typography>
		</Card>
	);
}

export default React.memo(Widget14);
