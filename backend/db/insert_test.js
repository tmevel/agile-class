const { insertRaspberryPi,
        insertActivationReport } 
        = require('./queries');


insertRaspberryPi("LivingRoom")
.then(res => {console.log(res)})
.catch(err => {console.log(err)});

insertActivationReport("06-04-2022 14:50:02", "/dir/bar", "dir/foo1", 1)
.then(res => { console.log(res) })
.catch(err => { console.log(err) });

insertActivationReport("04-04-2022 10:50:02", "/dir/foo", "dir/bar1", 1)
.then(res => { console.log(res) })
.catch(err => { console.log(err) });

insertActivationReport("04-04-2022 16:50:02", "/dir/foo/bar", "dir/foo1/bar1", 1)
.then(res => { console.log(res) })
.catch(err => { console.log(err) });

insertActivationReport("04-05-2022 14:55:02", "/dir/bar2", "dir/foo2", 1)
.then(res => { console.log(res) })
.catch(err => { console.log(err) });
