var express = require('express');
var app = express();
var bodyParser = require('body-parser');

//var jsdom = require('jsdom')
//, $ = require('jquery');

//var getJSON = require('get-json')
var engine = require('ejs-locals');
var jsSHA = require('jssha');
const request = require('request'); // 載入request模組
var path = require('path');
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('views engine', 'ejs');

app.use(express.static(path.join(__dirname, '/js')));
app.use(express.static(path.join(__dirname, '/map2.js')));
app.use(express.static(path.join(__dirname, '/css')));
app.use(express.static(path.join(__dirname, '/fonts')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.send(
        `<!DOCTYPE html>
        <html lang="en">
        <head>
            <link rel="stylesheet" type="text/css" href="bus.css">
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css" integrity="sha384-PsH8R72JQ3SOdhVi3uxftmaW6Vc51MKb0q5P2rRUpPvrszuE4W1povHYgTpBfshb" crossorigin="anonymous">
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
            <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js" integrity="sha384-vFJXuSJphROIrBnz7yo7oB41mKfc8JzQZiCq4NCceLEaO4IHwicKwpJf9c9IpFgh" crossorigin="anonymous"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/js/bootstrap.min.js" integrity="sha384-alpBpkh1PFOepccYVYDB4do5UnbKysX5WZXm3XxPqe5iKTfUKjNkCk9SaVuEZflJ" crossorigin="anonymous"></script>
            <title>bus</title>
        
            <style>
                    html,body,h1,h2,h3,h4,h5,h6 {
                        font-family: "微軟正黑體", sans-serif;
                    }
                    body{
                         background-color:#8F9CAE;
                         background-size:cover;
                         background-repeat: no-repeat;
                        
                    }           
            </style>
        
        </head>
        <body>   
            
            <div class= "container">
            <div class="w3-display-middle w3-round-xxlarge">
        
                <div class="rounded w3-panel w3-blue " style="text-align:center;background-color:#D6DDEE; height:300px;width:500px;line-height:30px" >
                
            <div class = "row justify-content-center ">
            <h2>    
                Timer
            </h2>
            </div>
            <form action="bus2_web" method = "get">
                <div class="row justify-content-center">
                    <div class="col col-lg-4 mb-auto p-4 ">
                        <input class="form-control sm-0" type="hidden" name = "start" placeholder="你的位置" aria-label="Search" id="start">
                    </div>
                </div>
        
                <div class="row justify-content-center">
                    <div class="col-6 col-md-4">
                        <input class="form-control sm-3" type="search" name = "end" placeholder="請輸入目的地" aria-label="Search" id="end">
                    </div>
                </div>
                
                &nbsp
        
                <div class="row justify-content-center">
                    <div class="col col-lg-2">
                        <button class="btn btn-secondary" type="submit" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false"
                            aria-controls="collapseExample">   
                     送出
                </button>
                    </div>
            </form>
            
            
            </div>
        
                </div>
            </div>
            <div>
                    <div id="floating-panel">
                                    </div>
                                    <div id="map"></div>
                                    &nbsp;
                                    <div id="warnings-panel"></div>
                                    
                                    <script src="https://maps.googleapis.com/maps/api/js?signed_in=true&callback=initMap"
                                        async defer></script>
                            
                            
            </div>
            </div>
        
        </body>
        </html>`
    )
  
})

app.get('/bus2_web',function(req,res){
    res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
            
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css" integrity="sha384-PsH8R72JQ3SOdhVi3uxftmaW6Vc51MKb0q5P2rRUpPvrszuE4W1povHYgTpBfshb" crossorigin="anonymous">
        <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
        <link rel="stylesheet" href="font-awesome.min.css">
        <title>bus</title>
        <style>
        html,body,h1,h2,h3,h4,h5,h6{
            font-family: "微軟正黑體", sans-serif;
        }
        </style>
    
    </head>
    <body>
            <script
            src="https://code.jquery.com/jquery-3.2.1.min.js"
            integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
            crossorigin="anonymous"></script>
          <script type="text/javascript" src="/map2.js"></script>
          <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAes3DR1i9TnqUFniT2529woIDFLwKvFkg&callback=initMap"
          async defer></script>
    
            <div class = "container">
            <div class="p-3 mb-2 bg-primary text-white  row align-items-center row justify-content-center" style="text-align:center;background-color:#0000AA;height:90px;width:100%;line-height:10px;font-size:15px">
            
            <div class = "row justify-content-center">
            <div class =  "col-8">
                    <i class="fa fa-bus fa-3x" aria-hidden="true"></i>
            </div>
            </div>
    
           <form  id="t" action="bus3_web" method = "get">
                    
                            <div class="col-6 col-md-4">
                                    <input class="form-control sm-0" type="hidden" name="start" placeholder="你的位置" aria-label="Search" id="start">
                            </div>
    
                    <div class="row justify-content-center">
                            <div class="col-8 ">
                                    <input class="form-control sm-6" type="search" name="end" placeholder="請輸入目的地" aria-label="Search" id="end">
                            </div>
                    </div>
                    
                    <div class="row justify-content-center">
                            <div class="col-12 ">
                                    <button class="btn btn-secondary" type="submit" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">開始導航</button>
                            </div>
                    </div>
                   
            </form>
            </div>
    
        
           
            </div>  
    
            
        
        <div class="body" style="text-align:center">
             
                    
            <div class="row marketing row justify-content-center" style="height: 800px">
                    
                    <div id="warnings-panel" class="col-12"></div>        
                    
                    <div class="col-8" id="map" style="display: none"></div>
                    <div>
                                    <div id="floating-panel"></div>
                                 
                                    &nbsp;
                                            
                                            
                    </div>
    
    
         </div>
    
         <script>
            autoEnter();
            showSteps();
         </script>
         
    </body>
    </html>`);
})

app.get('/bus3_web',function(req,res){
    var getstation_1 = req.query.station;
    console.log(getstation_1);
    var output='';
    //console.log(getstation_1);
    //console.log(getstation_1[0]);
    
        // var store_station = getstation_1[h]; 
        // console.log(store_station);
         request({
            url:"https://ptx.transportdata.tw/MOTC/v2/Rail/Metro/LiveBoard/KRTC?$format=JSON",
            headers:GetAuthorizationHeader(),
            json: true
          }, (error, response, body) => {
                if(error){console.log("錯誤");console.log(body);console.log(error);}
               // var output='';
                var result=body;
                var NumOfJData = result.length;
                for(var h = 0 ; h<getstation_1.length ;h++){
                for (var k = 0; k < NumOfJData; k++) {
                    var station_name = result[k].StationName.En+" Station";
                   console.log(getstation_1[h]);
                //   console.log(station_name);
                //    if(station_name=="World Game Station"){
                //         station_name="World Games Station"
                //    }
                    if(getstation_1[h]==station_name){
                        output=result[k].StationName.Zh_tw+result[k].TripHeadSign+"於"+result[k].EstimateTime+"分鐘後抵達<br>"+output;
                        console.log(output);
                        console.log("成功");
                        }
                }
            }
            res.send(`<!DOCTYPE html>
            <html lang="en">
            <head>
                    
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css" integrity="sha384-PsH8R72JQ3SOdhVi3uxftmaW6Vc51MKb0q5P2rRUpPvrszuE4W1povHYgTpBfshb" crossorigin="anonymous">
                <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
                <link rel="stylesheet" href="font-awesome.min.css">
                <title>bus</title>
                <style>
                html,body,h1,h2,h3,h4,h5,h6{
                    font-family: "微軟正黑體", sans-serif;
                }
                </style>
            
            </head>
            <body>
                <script >
                    function myrefresh()
                     {
                        window.location.reload();
                     }
                    setTimeout('myrefresh()',30000); //指定1秒刷新一次
                 </script>
                    <script src="js/bootstrap.offcanvas.js"></script> 
                    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
                    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.3/js/bootstrap.min.js" integrity="sha384-a5N7Y/aK3qNeh15eJKGWxsqtnX/wWdSZSKp+81YjTmS15nvnvxKHuzaWwXHDli+4" crossorigin="anonymous"></script>
                    <script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAxQgxVSNgt4=" crossorigin="anonymous"></script>
                    <script type="text/javascript" src="/map.js"></script>
                    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAes3DR1i9TnqUFniT2529woIDFLwKvFkg&callback=initMap&hl=zh-TW" async defer></script>
                    <!-- <script src="http://maps.google.cn/maps/api/js?region=cn&language=zh-CN&key=AIzaSyAes3DR1i9TnqUFniT2529woIDFLwKvFkg"></script> -->
                    <div class = "fluid-container">
                        <div class="p-3 mb-2 bg-primary text-white" style="text-align:center;background-color:#0000AA;height:170px;width:100%">
                            
                            <div class="row justify-content-center">
            
                                    <button class="navbar-toggler" type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                                            <i class="fa fa-bars fa-1x" aria-hidden="true"></i>
                                    </button>
                                    <a class="navbar-brand"></a>
                                    &nbsp
            
                                    <div class="col">
                                        <input  type="hidden" placeholder="你的位置" aria-label="Search" id="start">
                                    </div>
                    
                            
                                    <div class="col-12">
                                        <input  type="search" placeholder="請輸入目的地" aria-label="Search" id="end" >
                                    </div>      
                                    
                            </div>
                            
                           
                            <!-- <div class="row justify-content-center">
                                    <div class="col-6 col-md-4">
                                        <button class="btn btn-secondary" type="button" data-toggle="collapse"  data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample" id="submit">
                                            <span style="font-size:13px;">
                                                送出
                                            </span> 
                                        </button>
                                    </div>
                             -->
                             <button type="button" class="btn btn-lg btn-primary" id="submit" disabled></button>
                            <div class="" style="height:1px">
                            </div>
                                    <div class="col-12">
                                        <button class="btn btn-secondary" type="button" data-toggle="collapse"  aria-expanded="false" aria-controls="collapseExample" onclick="location.href='/'">
                                            <span style="font-size:13px;">
                                                取消導航
                                            </span>
                                            
                                        </button>
                                    </div>
                            </div> 
                        </div>
        
                    
                    <div class="row align-items-center row justify-content-center" style="text-align:center" >
            
                        <div class="col-12">
                            <button type="button" class="btn btn-dark" id="loop2">
                                <span style="font-size:13px;">
                                    
                                </span>
                            </button>
                        </div>  
                        &nbsp;
                        <div>
                             <button type="button" class="btn btn-dark" id="nextStep">
                                 <span style="font-size:13px;">
                                 `+output+`
                                 </span>
                             </button>
                             <div class="" style="height:1px">
                             </div>
                         </div>   
                    </div>
                        
                    </br>
                    
                    <div class="body" style="text-align:center">
                        <!-- <div class="row marketing" style="height: 1000px"> -->
                                    <div>
                                        <nav class="nav navbar-default">
                                            <div class="container-fluid">
                                                <div class="navbar-header">
                                                    <!-- <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                                                            <i class="fa fa-bars fa-1x" aria-hidden="true"></i>
                                                    </button>
                                                    <a class="navbar-brand">路線規劃</a> -->
                                                </div>
                                                <div class="collapse navbar-collapse" id="myNavbar">
                                                        <div id="warnings-panel" class="col-12"></div>
                                                </div>
                                        </nav> 
                                    </div>
            
                            <div class="col-12" id="map" style = "height : 500px"></div>
            
                            <!-- <div id="warnings-panel" class="col-12"></div> -->
                           
                            
                        </div>
                    </div>
                  
            <script>
                    autoEnter();
                    danny();
            </script>
            </body>
            </html>`);
        })

    // var getstation_2 = getstation_1;
    // request({
    //     url:"https://ptx.transportdata.tw/MOTC/v2/Rail/Metro/LiveBoard/KRTC?$format=JSON",
    //    headers:GetAuthorizationHeader(),
    //     json: true
    //   }, (error, response, body) => {
    //         if(error){console.log("錯誤");console.log(body);console.log(error);}
    //         var output="";
    //         var result=body;
    //         var NumOfJData = result.length;
    //         for (var i = 0; i < NumOfJData; i++) {
    //             if(getstation_2==result[i].StationID){
    //                 output="車站編號："+result[i].StationID+"/車站名稱："+result[i].StationName.Zh_tw+"/列車方向："+result[i].TripHeadSign+"/下班車預計抵達時間："+result[i].EstimateTime+"<br>"+output;
    //                 console.log(result[i].StationID);
    //                 console.log(result[i].StationName.Zh_tw);
    //                 }
    //         }
           
    //         res.send(
    //             `<html>
    //                 <head> 
    //                     <title>搜尋結果</title>
    //                 </head>
    //                 <body>
    //                     <p>`+output+`</p>
    //                     <script >
    //                         function myrefresh()
    //                         {
    //                             window.location.reload();
    //                         }
    //                         setTimeout('myrefresh()',9000); //指定1秒刷新一次
    //                     </script>
    //                 </body>
    //             </html>`);
            
    //     });

    //     function GetAuthorizationHeader() {
    //         var AppID = '8651028858fd4e40af317a75674d8cb5';
    //         var AppKey = 'Fk3eCwv0QM34ihzk1ORkfw3MFUQ';
        
    //         var GMTString = new Date().toGMTString();
    //         var ShaObj = new jsSHA('SHA-1', 'TEXT');
    //         ShaObj.setHMACKey(AppKey, 'TEXT');
    //         ShaObj.update('x-date: ' + GMTString);
    //         var HMAC = ShaObj.getHMAC('B64');
    //         var Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';
        
    //         return { 'Authorization': Authorization, 'X-Date': GMTString }; //如果要將js運行在伺服器，可額外加入 'Accept-Encoding': 'gzip'，要求壓縮以減少網路傳輸資料量
    //     }


    console.log(output);

})

app.post('/app',function(req,res){
    var getstation = req.body.station;
    console.log(getstation);
   
    // function getJSON(){
    // $.ajax({
    //       url: "https://data.kaohsiung.gov.tw/opendata/MrtJsonGet.aspx?site=115",
    //       method: "GET",
    //       dataType: "json",
    //       success: function(data) {
    //         alert("SUCCESS!!!");
    //       },
    //       error: function() {
    //         alert("ERROR!!!");
    //       }
    //     });
    // }
        // $.getJSON('https://data.kaohsiung.gov.tw/opendata/MrtJsonGet.aspx?site=115&callback=?',function(data) {
        //     console.log(data);
        //   });    
    
    request({
        url:"https://ptx.transportdata.tw/MOTC/v2/Rail/Metro/LiveBoard/KRTC?$format=JSON",
        //method: "GET",
       //strictSSL: false,
       headers:GetAuthorizationHeader(),
        json: true
      }, (error, response, body) => {
            if(error){console.log("錯誤");console.log(body);console.log(error);}
            var output="";
            var result=body;
            var NumOfJData = result.length;
            for (var i = 0; i < NumOfJData; i++) {
                if(getstation==result[i].StationID){
                    output="車站編號："+result[i].StationID+"/車站名稱："+result[i].StationName.Zh_tw+"/列車方向："+result[i].TripHeadSign+"/下班車預計抵達時間："+result[i].EstimateTime+"<br>"+output;
                    console.log(result[i].StationID);
                    console.log(result[i].StationName.Zh_tw);
                    }
            }
            //   var result=JSON.stringify(body, undefined, 2);
         //   for(var i=0;i<result.length;i++){    
            //   var result2 = result.split("/");
            //    var data=result[i];

           // console.log(data.StationID); // body是回傳的json物件，使用JSON.stringify()轉為json字串
         // }
            res.send(
                `<html>
                    <head> 
                        <title>搜尋結果</title>
                    </head>
                    <body>
                        <p>`+output+`</p>
                        <script >
                            function myrefresh()
                            {
                                window.location.reload();
                            }
                            setTimeout('myrefresh()',9000); //指定1秒刷新一次
                        </script>
                    </body>
                </html>`);
            
        });

        function GetAuthorizationHeader() {
            var AppID = '8651028858fd4e40af317a75674d8cb5';
            var AppKey = 'Fk3eCwv0QM34ihzk1ORkfw3MFUQ';
        
            var GMTString = new Date().toGMTString();
            var ShaObj = new jsSHA('SHA-1', 'TEXT');
            ShaObj.setHMACKey(AppKey, 'TEXT');
            ShaObj.update('x-date: ' + GMTString);
            var HMAC = ShaObj.getHMAC('B64');
            var Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';
        
            return { 'Authorization': Authorization, 'X-Date': GMTString }; //如果要將js運行在伺服器，可額外加入 'Accept-Encoding': 'gzip'，要求壓縮以減少網路傳輸資料量
        }


});


function GetAuthorizationHeader() {
    var AppID = '8651028858fd4e40af317a75674d8cb5';
    var AppKey = 'Fk3eCwv0QM34ihzk1ORkfw3MFUQ';

    var GMTString = new Date().toGMTString();
    var ShaObj = new jsSHA('SHA-1', 'TEXT');
    ShaObj.setHMACKey(AppKey, 'TEXT');
    ShaObj.update('x-date: ' + GMTString);
    var HMAC = ShaObj.getHMAC('B64');
    var Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';

    return { 'Authorization': Authorization, 'X-Date': GMTString }; //如果要將js運行在伺服器，可額外加入 'Accept-Encoding': 'gzip'，要求壓縮以減少網路傳輸資料量
}

app.listen(process.env.PORT || 3006);