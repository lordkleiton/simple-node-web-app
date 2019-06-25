const protocol = ''     //ex.: mongodb+srv
const user = ''         //db user
const password = ''     //db user password
const server = ''       //server url
const uri = `${protocol}://${user}:${password}@${server}`

exports.default = uri