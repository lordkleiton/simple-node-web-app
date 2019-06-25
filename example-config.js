const protocol = ''                                         //ex.: mongodb+srv
const user = ''                                             //db user
const password = ''                                         //db user password
const dbName = ''                                           //db name
const server = `/${dbName}`       //server url
const uri = `${protocol}://${user}:${password}@${server}`

exports.default = { uri, dbName }