const http = require('http')
const url = require('url')
const projects = require('./data-store')


const findProject = (id) => {
  const project = projects.filter(item => item.id == id)

  if(project.length === 0) return false

  return project[0]
}

const server = http.createServer((req, res) => {
  
  const requestedUrl = url.parse(req.url, true)
  const thePath = requestedUrl.path
  const containId = thePath.substring(10) !== '' ? thePath.substring(10) : false
  let projectData = false

  if(containId) {
    projectData = findProject(containId)
  } 
  if(requestedUrl.path === "/projects" ) {
    res.writeHead(400, {"Content-Type": "application/json"})
    const json = JSON.stringify({
      message: "BAD REQUEST"
    })
    res.end(json)
  } else if(!requestedUrl.path.includes("projects/")) {
    res.writeHead(404, "The route is invalid", {"Content-Type": "application/json"})
    res.end()
  } else if (requestedUrl.path.includes("projects/") && containId === false) {
    res.writeHead(400, {"Content-Type": "application/json"})
    const json = JSON.stringify({
      message: "BAD REQUEST"
    })
    res.end(json)
  } else if(!projectData) {
    res.writeHead(404, {"Content-Type": "application/json"})
    const json = JSON.stringify({
      message: "BAD REQUEST"
    })
    res.end(json)
  } else {
    res.writeHead(200, "k", {"Content-Type": "application/json"})
    
    const json = JSON.stringify(projectData)
    res.end(json)
    
  }
  
})


server.listen(8000)

module.exports = server