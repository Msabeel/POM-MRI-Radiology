
const commonHelper = 
{

    getObjectsKeyByObject : function (obj)
    {
        let Keys = [];
        for (var key in obj) 
        { 
            if (obj.hasOwnProperty(key)) {Keys.push(key)}
        }
        return Keys; 
    },

    getModalityWithSelection : function (obj)
    {
        let Keys = [];
        for (var i=0;i<obj.length;i++) 
        { 
            Keys.push({modality:obj[i],isSelected:false})
        }
        return Keys; 
    },
    getStatusWithSelection : function (obj)
    {
        let Keys = [];
        for (var i=0;i<obj.length;i++) 
        { 
            Keys.push({status:obj[i],isSelected:false})
        }
        return Keys; 
    },
    getStatusWithSelectionForStatus:function (obj)
    {
        let Keys = [];
        for (var i=0;i<obj.length;i++) 
        { 
            Keys.push({status:obj[i].status,
                isSelected:false,
                total_count:obj[i].total_count})
        }
        return Keys; 
    }

}

export default commonHelper;