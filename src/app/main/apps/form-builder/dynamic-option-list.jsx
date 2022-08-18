/**
  * <DynamicOptionList />
  */
 import {
	ISelectSearchFormsy,
	SelectSearchFormsy,
	SelectFormsy,
    TextFieldFormsy
} from '@fuse/core/formsy';
 import React, { useCallback, useEffect, useRef, useState } from 'react';
 import Typography from '@material-ui/core/Typography';
 import Icon from '@material-ui/core/Icon';
 import IconButton from '@material-ui/core/IconButton';
 import Checkbox from '@material-ui/core/Checkbox';
 import { withStyles } from '@material-ui/core/styles';
 import { useDispatch, useSelector } from 'react-redux';
 import ID from './UUID';

function DynamicOptionList (props) {
  const [state, setState]=useState({
		element: props.element,
		data: props.data,
		dirty: false,
	});
  
  useEffect(() => {
		if (props.element) {
      setState({
        ...state,
        element: props.element,
      });
		}
	}, [props.element]);


  function _setValue(text) {
    return text.replace(/[^A-Z0-9]+/ig, '_').toLowerCase();
  }

  function editOption(e, option_index) {
    var this_element = { ...state.element };
    const opt = { ...this_element.options[option_index]};
    opt.option = e.target.value;
    this_element.options[option_index] = { ...opt };
    setState({
      ...state,
      element: this_element,
      dirty: true,
    });
  }

  function editTrigger(e, option_index) {
    const this_element = { ...state.element };
    const opt = { ...this_element.options[option_index] };
    opt.q_trigger = e.target.checked;
    this_element.options[option_index] = { ...opt };
    setState({
      ...state,
      element: this_element,
      dirty: true,
    });
  }

  function editValue(e, option_index) {
    const this_element = state.element;
    const val = (e.target.value === '') ? _setValue(this_element.options[option_index].text) : e.target.value;
    this_element.options[option_index].value = val;
    setState({
      ...state,
      element: this_element,
      dirty: true,
    });
  }

  // eslint-disable-next-line no-unused-vars
  function editOptionCorrect(e, option_index) {
    const this_element = state.element;
    if (this_element.options[option_index].hasOwnProperty('correct')) {
      delete (this_element.options[option_index].correct);
    } else {
      this_element.options[option_index].correct = true;
    }
    setState({ ...state, element: this_element });
    props.updateElement(this_element);
  }

  function updateOption() {
    const this_element = state.element;
    // to prevent ajax calls with no change
    if (state.dirty) {
      props.updateElement(this_element);
      setState({ ...state, dirty: false });
    }
  }

  function addOption(index) {
    const this_element = state.element;
    this_element.options.splice(index + 1, 0, { value: '', option: '', key: ID.uuid() });
    props.updateElement(this_element);
  }

  function removeOption(index) {
    const this_element = state.element;
    this_element.options.splice(index, 1);
    props.updateElement(this_element);
  }

  return (
    <div className="dynamic-option-list">
      <ul>
        <li>
          <div className="flex mb-12">
            <div className="w-1/2">
              <Typography variant="subtitle1" className="font-bold" color="inherit">
                Options
              </Typography>
            </div>
            {/* { props.canHaveOptionValue &&
            <div className="w-1/4">
              <Typography variant="subtitle1" className="font-bold" color="inherit">
                Value
              </Typography>
            </div> } */}
            { state.element.isParent &&
            <div className="w-1/4">
              <Typography variant="subtitle1" className="font-bold" color="inherit">
                Q Trigger
              </Typography>
            </div> }
          </div>
        </li>
        {
          state.element.options.map((option, index) => {
            const this_key = `edit_${option.id}`;
            // const val = (option.value !== _setValue(option.option)) ? option.value : '';
            return (
              <li className="clearfix" key={this_key}>
                <div className="flex">
                  <div className="w-1/2 mb-24 mr-24">
                      <TextFieldFormsy
                        type="text"
                        tabIndex={index + 1}
                        name={`text_${index}`}
                        value={option.option} 
                        onChange={(e) => editOption(e, index)}
                        onBlur={updateOption}
                        id="content"
                        InputLabelProps={{
                          style: { color: '#000' },
                          }}
                        variant="outlined"
                        fullWidth
                      />
                  </div>
                  {/* { props.canHaveOptionValue &&
                  <div className="w-1/4 mr-24">
                    <TextFieldFormsy
                        type="text"
                        tabIndex={index + 1}
                        name={`value_${index}`}
                        value={val} 
                        onChange={(e) => editValue(e, index)}
                        InputLabelProps={{
                          style: { color: '#000' },
                          }}
                        variant="outlined"
                        fullWidth
                      />
                  </div> } */}
                  { state.element.isParent &&
                  <div className="w-1/4 mr-24">
                    <Checkbox 
                      name="q_trigger"
                      id="q_trigger"
                      onChange={(e) => editTrigger(e, index)}
                      checked={option.q_trigger}
                      value={option.q_trigger} 
                    />
                  </div> }
                  <div className="w-1/4">
                    <div className="flex">
                      <div onClick={(e) => addOption(index)}>
                        <IconButton className="w-16 h-16 rtl:mr-4 p-0 ml-20" color="inherit">
                          <Icon>add_circle</Icon>
                        </IconButton>
                      </div>
                      { index > 0 &&
                        <div onClick={(e) => removeOption(index)}>
                          <IconButton className="w-16 h-16 rtl:mr-4 p-0 ml-20" color="inherit">
                            <Icon>remove_circle</Icon>
                          </IconButton>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </li>
            );
          })
        }
      </ul>
    </div>
  );
}

export default DynamicOptionList;
