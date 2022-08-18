import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import RadioLogistDialog from '../../dialogs/RadioLogistDialog';
import Tooltip from '@material-ui/core/Tooltip';
import {openRadiologistEdit} from '../../store/ProfileSlice';

function RadiologistRenderer(props) {
    const [rad, setRad] = useState(props.value);
    const [isShow, setIsShow] = useState(false);
    const dispatch = useDispatch();
    const Radiologist = useSelector(({profilePageApp}) => profilePageApp.profile.radiologist);

    const onChangeRad = (event) => {
        props.onChangeRad(event.target.value);
        setRad(event.target.value);
        setIsShow(false)
    }
    const handleShow = () => {
        setIsShow(true)
    }
    // const handleShow = () => {
    //     const data = {
    //         rad_id: 0,
    //         referrer: rad,
    //         isGrid: true
    //     }

    //     // dispatch(openRadiologistEdit(data))
    //     setIsShow(true)
    // }

    const onClose = (data) => {
        if (data) {
            if (data.referrer)
                setRad(data.referrer)
        }
        setIsShow(false)
    }
    return (

        isShow ?
            // <>
            //     <Tooltip title={<h6 style={{padding: 5}}>{rad}</h6>} placement="top">
            //         <p>{rad}</p>
            //     </Tooltip>
            //     <RadioLogistDialog onClose={onClose} />
            // </>
            <select value={rad} onChange={onChangeRad}
                style={{
                    height: 40,
                    width: 110,
                    marginLeft: -17,
                    marginRight: -24,
                    borderWidth: 0,
                    backgroundColor: 'transparent',
                }}
            >
                {
                    Radiologist.map((item, index) => {
                        return (
                            <option value={item.displayname}> {item.displayname} </option>
                        )
                    })
                }

            </select>
            :
            <Tooltip title={<h6 style={{padding: 5}}>{rad}</h6>} placement="top">
                <p onDoubleClick={handleShow}>{rad?rad:'-'}</p>
            </Tooltip>
        // <p onDoubleClick={handleShow}>{rad}</p>



    )
}

export default RadiologistRenderer;