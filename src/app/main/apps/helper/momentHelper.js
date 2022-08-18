import moment from 'moment'

const momentHelpers = {

    getQuarterRange: function(quarter)
    {
        const start = moment().quarter(quarter).startOf('quarter').format('YYYY-MM-DD');
        const end = moment().quarter(quarter).endOf('quarter').format('YYYY-MM-DD');
        return {start, end};
    },
    getThisYear: function()
    {
        const start = moment().startOf('year').format('YYYY-MM-DD');
        const end = moment().endOf('year').format('YYYY-MM-DD');
        return {start, end};
    },
    today: function()
    {
        const start =moment().format('YYYY-MM-DD');
        const end =moment().format('YYYY-MM-DD');
        return {start, end};
    },
    tomorrow: function(){
        const start = moment().add(1, 'days').format('YYYY-MM-DD');
        const end = moment().add(1, 'days').format('YYYY-MM-DD');
        return {start, end};
    },
    yasterday: function(){
        const start = moment().add(-1, 'days').format('YYYY-MM-DD');;
        const end = moment().add(-1, 'days').format('YYYY-MM-DD');;
        return {start, end};
       
    },
    lastSevenDays: function(){
        const start = moment().add(-7, 'days').format('YYYY-MM-DD');
        const end =moment().add(-7, 'days').format('YYYY-MM-DD');
        return {start, end};
    },
    LastThirtyDays: function(){
        const start = moment().add(-30, 'days').format('YYYY-MM-DD');
        const end =moment().add(-30, 'days').format('YYYY-MM-DD');
        return {start, end};
       
    }
    
}

export default momentHelpers;
