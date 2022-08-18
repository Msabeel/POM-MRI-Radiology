import React, { createContext } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

function CircularProgressWithLabel(props) {
  return (
    <Grid container justify='center'>
        <Box position="relative" display="inline-flex">
      <CircularProgress style={{'transition': 'all 0.2s', 'transform': 'rotate(-90deg)' }} variant="determinate" {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption"  component="div" color="textSecondary">{localStorage.getItem('progressAXBY')}% </Typography>
      </Box>
    </Box>
    </Grid>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

export default function CircularStatic() {
  const [progress, setProgress] = React.useState(0);
  localStorage.setItem('progressAXBY', progress);
  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress <= 94 ?  prevProgress + 7 : 100));
    },1300);
    localStorage.setItem('progressAXBY', progress);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return <CircularProgressWithLabel value={localStorage.getItem('progressAXBY')<=7 ? 1 : localStorage.getItem('progressAXBY')-13} />;
}