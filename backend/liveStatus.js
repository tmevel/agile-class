liveStatus = {
    status: new Map(),


    toggleStatus: function(numLive){
        if(!this.status.has(numLive)){
            return 'UNCONNECTED'
        }
        if(this.status.get(numLive) == 'ON'){
            this.status.set(numLive,'OFF')
        }else{
            this.status.set(numLive,'ON')
        }
        return this.status.get(numLive)
    },
    getStatus: function(numLive){
        if(!this.status.has(numLive)){
            return 'UNCONNECTED'
        }
        return this.status.get(numLive)
    },
    keepAlive: function(numLive){
        if(!this.status.has(numLive)){
            this.status.set(numLive,{
                status:'ON',
                lastupdate: Date.now(),
            })
        }else{
            this.status.get(numLive).lastupdate = Date.now()
        }
    },
    deleteDeadLives: function(){
        for (var entry of this.status.entries()) {
            let liveNum = entry[0]
            let lastUpdate = entry[1].lastupdate
            if(Date.now()-lastUpdate>10000){ //more than 10s
                this.status.delete(liveNum)
            }
        }
    },
    getLivesList: function(){
        this.deleteDeadLives()
        return Array.from(this.status)
    },
};

module.exports = liveStatus