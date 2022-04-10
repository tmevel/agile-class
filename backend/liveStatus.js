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
    getLivesList: function(){
        return Array.from(this.status)
    },
    createLive: function(){
        let i = 0
        while(this.status.has(i)){
            i++
        }
        this.status.set(i,'ON')
        return i
    },
    deleteLive: function(numLive){
        this.status.delete(numLive)
    }
};

module.exports = liveStatus