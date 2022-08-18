import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import ReffererDialog from '../../dialogs/ReffererDialog';
import {openReffererEdit} from '../../store/ProfileSlice';
import Tooltip from '@material-ui/core/Tooltip';
function RafererRenderer(props) {
    const dispatch = useDispatch()
    const [raf, setRaf] = useState(props.value);
    const [isShow, setIsShow] = useState(false);
    const Refferers = useSelector(({profilePageApp}) => profilePageApp.profile.refferers);
    const onChangeRef = (event) => {
        props.onRefChange(event.target.value);
        setRaf(event.target.value);
    }
    const handleShow = () => {
        const data = {
            ref_id: 0,
            referrer: raf,
            isGrid: true
        }

        dispatch(openReffererEdit(data))
        setIsShow(true)
    }
    const onClose = (data) => {
        if (data) {
            if (data.referrer)
                setRaf(data.referrer)

        }
        setIsShow(false)
    }
    return (
        isShow ?
            <>
                <Tooltip title={<h6 style={{padding: 5}}>{raf}</h6>} placement="top">
                    <p>{raf}</p>
                </Tooltip>
                <ReffererDialog onClose={onClose} />
            </>
            // <select value={raf} onChange={onChangeRef}
            //     style={{
            //         height: 40,
            //         width: 120,
            //         marginLeft: -17,
            //         marginRight: -17,
            //         borderWidth: 0,
            //         backgroundColor: 'transparent',
            //         padddingLeft: 10,
            //         paddingRight: 10
            //     }}
            // >
            //     {
            //         Refferers.map((item, index) => {
            //             return (
            //                 <option value={item.name}> {item.name} </option>
            //             )
            //         })
            //     }

            //     {/* <option value="black"> black </option>
            //     <option value="green"> green </option>
            //     <option value="yellow"> yellow </option>
            //     <option value="violet"> violet </option> */}
            // </select>
            :
            <Tooltip title={<h6 style={{padding: 5}}>{raf}</h6>} placement="top">
                <p onDoubleClick={handleShow}>{raf}</p>
            </Tooltip>


    )
}

export default RafererRenderer;