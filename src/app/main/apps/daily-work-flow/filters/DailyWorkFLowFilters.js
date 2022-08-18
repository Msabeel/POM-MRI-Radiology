
import React, { useEffect, useState,useRef } from 'react';
//import Widget1 from './widgets/Widget1';
import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import {ModalityCard} from  './ModalityCard'
import commonHelper from '../../helper/commonHelper'
import {StatusCard} from './StatusCard'
import FuseAnimate from '@fuse/core/FuseAnimate';
import Typography from '@material-ui/core/Typography';
import dailyWorkFlowHelper from '../../helper/dailyWorkFlowHelper'

function DailyWorkFLowFilters(props) {

    const [modalityCount, setModalityCount] = useState(commonHelper.getObjectsKeyByObject({
        "MR": {
          "label": "MR",
          "total_count": 170,
          "child": {
            "1": {
              "modality": "MR-1.5T",
              "count": 32,
              "is_checked": false
            },
            "6": {
              "modality": "MR-Boca",
              "count": 0,
              "is_checked": false
            },
            "7": {
              "modality": "MR-Open",
              "count": 10,
              "is_checked": false
            },
            "39": {
              "modality": "MRI-CC",
              "count": 61,
              "is_checked": false
            },
            "49": {
              "modality": "MRI-CS",
              "count": 27,
              "is_checked": false
            },
            "56": {
              "modality": "MRI-FT",
              "count": 40,
              "is_checked": false
            }
          }
        },
        "CT": {
          "label": "CT",
          "total_count": 58,
          "child": {
            "2": {
              "modality": "CT-PLANT",
              "count": 30,
              "is_checked": false
            },
            "34": {
              "modality": "CT-BOCA",
              "count": 0,
              "is_checked": false
            },
            "45": {
              "modality": "CT-CC",
              "count": 28,
              "is_checked": false
            }
          }
        },
        "CR": {
          "label": "CR",
          "total_count": 144,
          "child": {
            "3": {
              "modality": "XR-PLANT",
              "count": 83,
              "is_checked": false
            },
            "33": {
              "modality": "CR-BOCA",
              "count": 0,
              "is_checked": false
            },
            "40": {
              "modality": "XR-CC",
              "count": 61,
              "is_checked": false
            }
          }
        },
        "DX": {
          "label": "DX",
          "total_count": 27,
          "child": {
            "4": {
              "modality": "DEXA-PLANT",
              "count": 10,
              "is_checked": false
            },
            "35": {
              "modality": "DEXA-BOCA",
              "count": 0,
              "is_checked": false
            },
            "44": {
              "modality": "DEXA_CC",
              "count": 17,
              "is_checked": false
            },
            "63": {
              "modality": "DEXAFT",
              "count": 0,
              "is_checked": false
            }
          }
        },
        "US": {
          "label": "US",
          "total_count": 135,
          "child": {
            "5": {
              "modality": "US-PLANT",
              "count": 68,
              "is_checked": false
            },
            "32": {
              "modality": "US-SS",
              "count": 0,
              "is_checked": false
            },
            "36": {
              "modality": "US-BOCA",
              "count": 0,
              "is_checked": false
            },
            "38": {
              "modality": "US-CC",
              "count": 55,
              "is_checked": false
            },
            "48": {
              "modality": "BIOPSY",
              "count": 2,
              "is_checked": false
            },
            "55": {
              "modality": "CS-US",
              "count": 0,
              "is_checked": false
            },
            "59": {
              "modality": "US-CC2",
              "count": 0,
              "is_checked": false
            },
            "62": {
              "modality": "US-FT",
              "count": 10,
              "is_checked": false
            }
          }
        },
        "MG": {
          "label": "MG",
          "total_count": 73,
          "child": {
            "10": {
              "modality": "MG-PLANT",
              "count": 48,
              "is_checked": false
            },
            "14": {
              "modality": "MG-GE",
              "count": 0,
              "is_checked": false
            },
            "37": {
              "modality": "MG-BOCA",
              "count": 0,
              "is_checked": false
            },
            "43": {
              "modality": "MG-CC",
              "count": 23,
              "is_checked": false
            },
            "61": {
              "modality": "MG-FT",
              "count": 2,
              "is_checked": false
            }
          }
        },
        "": {
          "label": "",
          "total_count": 1,
          "child": {
            "11": {
              "modality": "MR-Plant-PICKUP",
              "count": 0,
              "is_checked": false
            },
            "15": {
              "modality": "MG-PICKUP",
              "count": 0,
              "is_checked": false
            },
            "16": {
              "modality": "DEXA-PICKUP",
              "count": 0,
              "is_checked": false
            },
            "17": {
              "modality": "US-PICKUP",
              "count": 0,
              "is_checked": false
            },
            "19": {
              "modality": "CR-PICKUP",
              "count": 0,
              "is_checked": false
            },
            "20": {
              "modality": "MR Boca-PICKUP",
              "count": 0,
              "is_checked": false
            },
            "28": {
              "modality": "CT-PICKUP",
              "count": 0,
              "is_checked": false
            },
            "29": {
              "modality": "CD-Films PLANT",
              "count": 0,
              "is_checked": false
            },
            "31": {
              "modality": "CD-Films BOCA",
              "count": 0,
              "is_checked": false
            },
            "41": {
              "modality": "MR CC-PICKUP",
              "count": 0,
              "is_checked": false
            },
            "42": {
              "modality": "CD-Films CC",
              "count": 0,
              "is_checked": false
            },
            "50": {
              "modality": "MR Coral Springs-PICKUP\t",
              "count": 0,
              "is_checked": false
            },
            "51": {
              "modality": "MR Coral Springs-PICKUP\t",
              "count": 0,
              "is_checked": false
            },
            "52": {
              "modality": "MR CS-PICKUP\t",
              "count": 0,
              "is_checked": false
            },
            "53": {
              "modality": "CD-Films CS",
              "count": 1,
              "is_checked": false
            },
            "57": {
              "modality": "Transportation Fort Lauderdale",
              "count": 0,
              "is_checked": false
            },
            "58": {
              "modality": "FT-Pickup",
              "count": 0,
              "is_checked": false
            },
            "64": {
              "modality": "CD-Films FT Lauderdale",
              "count": 0,
              "is_checked": false
            },
            "65": {
              "modality": "New Pending SCRIPT - CC",
              "count": 0,
              "is_checked": false
            },
            "66": {
              "modality": "New Pending SCRIPT - PLANT",
              "count": 0,
              "is_checked": false
            },
            "67": {
              "modality": "New Pending SCRIPT - FT",
              "count": 0,
              "is_checked": false
            },
            "68": {
              "modality": "New Pending SCRIPT - CS",
              "count": 0,
              "is_checked": false
            }
          }
        },
        "DF": {
          "label": "DF",
          "total_count": 1,
          "child": {
            "60": {
              "modality": "FLUORO-CC",
              "count": 1,
              "is_checked": false
            }
          }
        },
        "TR": {
          "label": "TR",
          "total_count": 0,
          "child": {
            "69": {
              "modality": "TESTMGT",
              "count": 0,
              "is_checked": false
            }
          }
        }
      }))
    const [statusCount,setStatusCount] = useState(dailyWorkFlowHelper.getStatusListAndCountByMainObject(props.status_list))  

     
    const getLocationFilterByModalities = (modalities) => {
      //props.setLocationFilterByModalities(modalities);
    }
    const getChildModalitiesByModality = (modalities) => {
      props.setChildModalitiesByModality(modalities);
    }

	return (
        <>
        <div className="p-12">
       
        <FuseAnimateGroup 	
        className="flex flex-wrap"					
        enter={{animation: 'transition.slideUpBigIn'}} >
        <ModalityCard 
        getLocationFilterByModalities={getLocationFilterByModalities} 
        modalityCount={modalityCount}
        getChildModalitiesByModality={getChildModalitiesByModality} 
        > 
        </ModalityCard>
        
				<div className="flex flex-col sm:flex sm:flex-row pb-32">
        <StatusCard statusCount={statusCount}></StatusCard>
        </div>
        </FuseAnimateGroup>
        </div>
        </>
    
    );
}


export default DailyWorkFLowFilters;