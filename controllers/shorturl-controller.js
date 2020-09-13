var connection = require('./../config');
const shortid = require('shortid');
var url = require('url') ;
const requestIp = require('request-ip');


module.exports.shorturl=function(req,res){   
    var hostname = req.headers.host;
    var pathname = url.parse(req.url).pathname;
    var baseUrl = '/short';
    const clientIp = requestIp.getClientIp(req);     
    const urlCode = shortid.generate();
    const shortUrl = baseUrl + "/" + urlCode;
    var today = new Date();
    var users={
        "long_url":req.body.shortLink,
        "short_url":shortUrl,
        "ip":clientIp,
        "created_date":today
    }
 
    connection.query('INSERT INTO tbl_shorturl SET ?',users, function (error, results, fields) {
      if (error) {
        res.json({
            status:false,
            message:'there are some error with query'
        })
      }else{
          res.json({
            status:true,
            //data:results,
            shorturl: shortUrl,
            longurl: req.body.shortLink
           
        })
      }
    });
}

module.exports.shorturllist=function(req,res){   
 
    connection.query('Select * from tbl_shorturl', function (error, results,fields) {
      if (error) {
          console.log(error);
        res.json({
            status:false,
            message:error
        })
      }else{
        res.json({
            status:true,
            data:results    
        })
        
      }
    });

}

module.exports.short=function(req,res){
  
    let shortUrlCode = req.params.link_name;
    let slink = "/short/"+shortUrlCode;
    connection.query('Select * from tbl_shorturl WHERE short_url = ?',[slink], function (error, results,fields) {
        if (error) {
            console.log(error);
          res.json({
              status:false,
              message:error
          })
        }else{
            if(results.length>0){
                let click_count  = results[0]['click_count'];
                let shortUrl  = results[0]['short_url'];
                click_count = click_count + 1;              
                connection.query('update tbl_shorturl set click_count = ? where short_url = ?',[click_count,shortUrl], function (error, results,fields) {
                   
                })

               var longUrl  = results[0]['long_url'];
               return res.redirect(longUrl);
            }else{
                res.json({
                    status:false,
                    message:'Invalid URL'    
                })
            }
          
          
        }
      });
}

