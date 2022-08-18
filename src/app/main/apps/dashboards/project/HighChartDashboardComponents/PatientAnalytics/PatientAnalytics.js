
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import React, { useEffect, useRef, useState } from 'react';
import reducer from '../../store';
import withReducer from 'app/store/withReducer';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar';
import PermissionSwitch from 'app/fuse-layouts/shared-components/PermissionSwitch';
import DateFilter from './Filters/DateFilter'

const options = {
    chart: {
        type: 'column',
        /*
        options3d: {
            enabled: true,
            alpha: 10,
            beta: 25,
            depth: 70
        }
        */
    },
    title: {
        text: 'Patient Analytics'
    },
    subtitle:{
    text:'Total: '+'200',
    style:{color:'#sdf353'}
    },
    credits: {
            enabled: false
        },
    plotOptions: {
        column: {
            depth: 25
        }
    },
    xAxis: {
    visible:false,
        labels: {
            skew3d: true,
            style: {
                fontSize: '16px'
            }
        }
    },
    yAxis: {
        title: {
            text: null
        }
    },
    plotOptions: {
            column: {
                dataLabels: {
                    enabled: true,
                    crop: false,
                    overflow: 'none'
                }
            }
        },
    series: [{
        name: 'MR',
        data: [20],
        //color:'#058DC7'
    },{
        name: 'MT',
        data: [2],
       // color:'#AA4643'
    },{
        name: 'CD',
        data: [9],
       // color:'#89A54E'
    },{
        name: 'XD',
        data: [7],
       // color:'#4572A7'
    },{
        name: 'OP',
        data: [12],
       // color:'#4572A7'
    },{
        name: 'IU',
        data: [21],
       // color:'#4572A7'
    },
    ]
}

function PatientAnalytics(props) {

	return (
        <Card className="w-full rounded-8 shadow-1">
        <AppBar position="static">
            <div className="p-16 px-4 flex flex-row items-center justify-between">
                <div className="px-12">
                    <Typography className="h1 font-300" color="inherit">
                        Completed Vs Scheduled
                    </Typography>
                    
                    <Typography className="h1 font-300" color="inherit">
                    Filter: <DateFilter/>
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


export default withReducer('projectDashboardApp', reducer)(PatientAnalytics);