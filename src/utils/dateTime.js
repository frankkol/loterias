module.exports.dt = function() {
    var dateNow = new Date()
    var day = ("0"+dateNow.getDate()).slice(-2)
    var month = ("0"+dateNow.getMonth()).slice(-2)
    var year = dateNow.getFullYear()
    var hour = ("0"+dateNow.getHours()).slice(-2)
    var minuts = ("0"+dateNow.getMinutes()).slice(-2)
    var seconds = ("0"+dateNow.getSeconds()).slice(-2)
 
    var dateFormat = `${day}-${month}-${year}T${hour}:${minuts}:${seconds}`
    return dateFormat
}