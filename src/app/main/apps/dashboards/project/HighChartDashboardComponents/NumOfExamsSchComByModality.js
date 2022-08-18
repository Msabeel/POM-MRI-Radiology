
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import React, { useEffect, useRef, useState } from 'react';
import reducer from '../store';
import withReducer from 'app/store/withReducer';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar';
import PermissionSwitch from 'app/fuse-layouts/shared-components/PermissionSwitch';
const options = {

    chart: {
        type: 'areaspline'
    },
    title: {
        text: ''
    },
    legend: {
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'top',
        x: 60,
        y: 20,
        floating: true,
        borderWidth: 1,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF'
    },
    xAxis: {
        categories: [
            'MR',
            'MX',
            'MD',
            'XX',
            'CC',
            'ZZ',
            'FF'
        ],
        /*
        plotBands: [{ // visualize the weekend
            from: 4.5,
            to: 6.5,
            color: 'rgba(68, 170, 213, .2)'
        }]
        */
    },
        yAxis: {
            title: {
                text: 'No of exams'
            }
        },
        tooltip: {
            shared: true,
            valueSuffix: ' exams'
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            areaspline: {
                fillOpacity: 0.5
            }
        },
        series: [{
            name: 'Completed',
            data: [1, 2, 3, 5, 4, 10, 12]
        }, {
            name: 'Schedule',
            data: [1, 2, 4, 3, 3, 5, 4]
        }]
  }

function NumOfExamsSchComByModality(props) {

	return (
        <Card className="w-full rounded-8 shadow-1">
        <AppBar position="static">
            <div className="p-16 px-4 flex flex-row items-center justify-between">
                <div className="px-12">
                    <Typography className="h1 font-300" color="inherit">
                        Completed Vs Scheduled
                    </Typography>
                </div>
                <PermissionSwitch permission="completed_exams" />
                <div>
                    <IconButton aria-label="more" color="inherit">
                        <Icon>more_vert</Icon>
                    </IconButton>
                </div>
            </div>
            {/*
            <div className="p-16 pt-8 flex flex-row justify-between items-end">
                <Typography className="text-48 font-300 leading-none" color="inherit">
                    {data.today}
                </Typography>
                <div className="flex flex-row items-center">
                    {data.change.value > 0 && <Icon className="text-green">trending_up</Icon>}
                    {data.change.value < 0 && <Icon className="text-red">trending_down</Icon>}
                    <div className="mx-8">
                        {data.change.value}({data.change.percentage}%)
                    </div>
                </div>
            </div>
            */}
            {/*
            <Tabs //value={tabIndex} 
           // onChange={(ev, index) => setTabIndex(index)} 
            variant="fullWidth">
                <Tab label="Last Month" className="min-w-0" />
                <Tab label="This Month" className="min-w-0" />
                <Tab label="Next Month" className="min-w-0" />
            </Tabs>
            */}
        </AppBar>
        <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </Card>
       
    );

}


export default withReducer('projectDashboardApp', reducer)(NumOfExamsSchComByModality);