    'use strict'

    var http = require('http')
    var url = require('url')
    var fs = require('fs')
    var marked   = require('marked')
    
    var monArr = ['January','February','March','April','May','June','July','August','September','October','November','December']



    function unixtime(unix) {
      var d = new Date(unix*1000)
      var year = d.getFullYear()
      var date = d.getDate()
      var month = d.getMonth()       
      var natural = monArr[month]+' '+date+', '+year
      return {
        unix: unix,
        natural: natural,
      }
    }

    function naturaltime (natural) {
      var date = decodeURIComponent(natural)
      var dateArr = date.split(/\s|,/);
      dateArr = dateArr.filter(function(e) {
        if (e) 
          return e
      })
      var month = dateArr[0]
      var day = dateArr[1]
      var year = dateArr[2]
     
      var monthNum = 0
      var reg = new RegExp(month)
      monArr.forEach(function(e, i){        
        if(reg.test(e)) {
          monthNum = i
          return
        }
      })
      var unix = Date.parse(new Date(year, monthNum, day))/1000
      if (!unix)
        date = null
      return {
        unix: unix,
        natural: date,
      }
    }
    
    var server = http.createServer(function (req, res) {
      
      var parsedUrl = url.parse(req.url, true)
     // console.log(parsedUrl)
      var time = parsedUrl.path.substr(1)
      
      if(time) {
        
        var result = {}
        // param is number
        if (+time) {          
          result = unixtime(+time)
        } else { // param is string        
          result = naturaltime(time)
        }
        
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(result))
       } else {
         
        fs.readFile(__dirname + '/README.md', function(err, data) {
          if(err) return 
          var html = marked(data.toString())
          
          res.writeHead(200, { 'Content-Type': 'text/html' })
          res.end(html)
        })
      }
    })
    
    server.listen(process.env.PORT)

