
const dailyWorkFlowHelper = 
{

    getChildModalityIDsFromModalityDD : function (Modalities)
    {
        let modalitiesID = [];
        for(var i=0;i<Modalities.length;i++)
        {
            modalitiesID.push(Modalities[i].modalityID)
        } 
        return modalitiesID     
    },

    getChildsModalityByModality: function(mainObject,Modalities)
    {
        let childs = [];
        for(var i=0;i<Modalities.length;i++)
        {
            const filteredByKey = Object.fromEntries(
            Object.entries(mainObject).filter(([key, value]) => key === Modalities[i]) )
            
            for (var key of Object.keys(mainObject[Modalities[i]].child)) {
               // childs.push(mainObject[Modalities[i]].child[key].modality)
                
                childs.push({modality:mainObject[Modalities[i]].child[key].modality,
                    modalityID:key
                })
                
            }
          
        }
        
        return childs;
    },
    getLocationDDFromMainObject:function(locations)
    {   
        let Locations=[];
        for (var key of Object.keys(locations)) {
            Locations.push(key);
        }
        return Locations;
            
    },
    getStatusListAndCountByMainObject: function (status_list)
    {
        let Keys = [];
        for (var key in status_list) 
        { 
            if (status_list.hasOwnProperty(key)) 
            {
                Keys.push({status:key,total_count:status_list[key].total_count})
            }
        }
        return Keys;
    }

   

}

export default dailyWorkFlowHelper;