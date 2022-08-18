
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import React, { useEffect, useRef, useState } from 'react';
import reducer from '../store';
import withReducer from 'app/store/withReducer';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';

const options = {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Patient Per Location'
        },
        subtitle: {
          //  text: 'Source: WorldClimate.com'
        },
        xAxis: {
            categories: [
                'Location 1',
                'Location 2',
                'Location 3',
                'Location 4',
                'Location 5',
                'Location 6',
                'Location 7',
               
            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Patient Count'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Today',
            data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6,]
    
        }, {
            name: 'Yasterday',
            data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0,]
    
        }, {
            name: 'Tommorow',
            data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4]
    
        }]
    
  }

function NumOfPatientComingToEachLocation(props) {

	return (
<Card className="w-full rounded-8 shadow-1">
			<div className="relative p-24 flex flex-row items-center justify-between">
				<div className="flex flex-col">
					<Typography className="h3 sm:h2">No Of Exams By Modality</Typography>
				</div>
                {
                /*
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
                */
                }
			</div>
            <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
		</Card>
       
    );

}


export default withReducer('projectDashboardApp', reducer)(NumOfPatientComingToEachLocation);