liveStatus = {
    status: 'ON',

    toggleStatus: function(){
        if(this.status == 'ON'){
            this.status = 'OFF'
        }else{
            this.status = 'ON'
        }
    }
};

module.exports = liveStatus