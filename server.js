var express = require('express');
var app = express();
//var Gpio = require('onoff').Gpio,
//    led = new Gpio(17, 'out');
var RaspiCam = require('raspicam');
var fs = require('fs');
//var sqlite = require('sqlite3').verbose();
//var db = new sqlite.Database('photos2.db');
var pg_caller = require("./postgres_caller");

app.use(express.static(__dirname + "/public"))

app.get('/takePicture', function (req, res){
	console.log("bild tas just nu");
	//var time = new Date();
	//var times = getTimestamp(time);
	//var timestamp = times.timestamp;	
	// ---- Skapa ny cameramodul -------
	var photo_timestamp = new Date();
	var photo_location = "/home/pi/raspicam_photos/ruttnero_services/";
	var photo_name = getPicNameFromJSTimestamp(photo_timestamp)

	var camera = new RaspiCam({
		mode: "photo", 
		w:640,
		timeout: 500,
		quality: 15,
		output: photo_location + photo_name
	});
	// fromPostgresTimestamp
	// getPicNameFromJSTimestamp
	// fromJSTimestamp
	
	photo = {
    		path: photo_location + photo_name,
    		timestamp: fromJSTimestamp(photo_timestamp)    	
    };	

	process_id = camera.start();

	camera.on("exit", function(){
		
		camera.stop(process_id);
		console.log('kameran är nu nerstängd');
		
		query = getInsertQuery(photo) //'insert into raspicam_photos (pic_timestamp, pic_path) values("' + String(photo.timestamp) + '"::timestamp,"' + photo_location + photo_name + '")'

		var handleResponse = function(rows){

			console.log("got response")
			console.log(rows)
		}
		pg_caller.runInsertQuery(query, handleResponse)   
		// db.serialize(function() {				
		// 	db.run("CREATE TABLE if not exists pictures (url TEXT, year TEXT, month TEXT, day TEXT, hour TEXT, min TEXT, sek INTEGER)");
		// 	var stmt = db.prepare("INSERT INTO pictures VALUES (?,?,?,?,?,?,?)");
		// 	  stmt.run(url.dyn, times.year, times.month, times.day, times.hour, times.min, times.sek);
		// 	stmt.finalize();
		// 	db.each("SELECT url,year,month,day,hour,min,sek FROM pictures", function(err, row) {
		// 		console.log(' url:' +row.url + '| ' + row.year + '| ' + row.month + '| ' + row.day + '| ' + row.hour + '| ' + row.min + '| ' + row.sek);
		// 	}, function(){
		// 		res.json(url);
		// 		console.log("----------------------- ");
		// 	});
		// });

	});


});



app.get("/run_postgres_query", function (req,res) {
    var reqData = req.query;
    var query = reqData.query;

    console.log("inne i get_apartments")
    var handleResponse = function(rows){
        console.log("inside apartments handle response");
        //console.log(rows)
        //console.log(JSON.stringify(rows))


        
        if(rows.db_success == false){ //check if an ERRROR was returned by trafiklab
            console.log('server sad =(')
            res.json({
                success: false,
                message: "somthing went wrong :/",
                data: rows.data
            });
        }else{ 
            console.log('server happy =)')
            //console.log(rows)
            res.json({
                success: true,
                message: "Got data =)",
                data: rows.data
            });
        }
    } 
    pg_caller.runQuery(query, handleResponse)   
});






app.get('/getPictureUrls', function (req, res){
	query = 'select * from raspicam_photos'
	console.log("inne i get_apartments")
    var handleResponse = function(rows){
        console.log("inside apartments handle response");
        //console.log(rows)
        //console.log(JSON.stringify(rows))


        
        if(rows.db_success == false){ //check if an ERRROR was returned by trafiklab
            console.log('server sad =(')
            res.json({
                success: false,
                message: "somthing went wrong :/",
                data: rows.data
            });
        }else{ 
            console.log('server happy =)')
            //console.log(rows)
            res.json({
                success: true,
                message: "Got data =)",
                data: rows.data
            });
        }
    } 
    pg_caller.runQuery(query, handleResponse)  
});


app.get('/getLatestPicUrl', function (req, res){
	var yay=[];	
	db.serialize(function() {
		
		db.each("SELECT rowid,url FROM pictures ORDER BY rowid DESC LIMIT 1;", function(err, row) {
			yay.push({id: row.rowid,
			adress: row.url});
		}, function(row){
			res.json(yay);
		});
	});
	console.log(yay);
});



app.get('/dropDb', function (req, res){
	db.serialize(function() {
		db.run("drop table pictures");
		
		console.log('nu ska databasen vara tom');
	});
});

app.get('/exempel', function (req, res){
	console.log("jag fick ett get request exempel");

    exempel = {
    success: 'true',
    data: 'Whatup'
    };
    
    res.json(exempel);
});

fromPostgresTimestamp = function(postgres_timestamp){
	var day = new Date(postgres_timestamp.replace(' ','T')+'Z');
	return day
}
getPicNameFromJSTimestamp = function(js_timestamp){
	str = js_timestamp.toISOString()
	return str.slice(0, 10) + '-' + str.slice(11, 19) + '.jpg';
}
fromJSTimestamp = function(js_timestamp){
	str = js_timestamp.toISOString()
	return str.slice(0, 10) + ' ' + str.slice(11, 19);
}

getInsertQuery = function (picObject){
    queryString = 'insert into raspicam_photos (pic_timestamp, pic_path) values($1,$2)'
    data = [
    picObject.timestamp,
    picObject.path
    ]
    return [queryString, data];
}
// getTimestamp = function(tid){
	
// 	var year = tid.getUTCFullYear();
// 	var month = tid.getUTCMonth()+1;
// 	var day = tid.getUTCDate();
// 	var hour = tid.getUTCHours();
// 	var min = tid.getUTCMinutes();
// 	var sek = tid.getUTCSeconds();
// 	var offset = (tid.getTimezoneOffset()/60)

// 	if ((hour-offset)>23){
// 		day = day + 1;
// 	};
	
// 	hour = (hour - offset)%24;
	

// 	var times = {
// 		timestamp: '',
// 		year: year,
// 		month: month,
// 		day: day,
// 		hour: hour,
// 		min: min,
// 		sek: sek
// 		}
		
// 	if (month < 10){
// 		month = '0' + month.toString();
// 	};	
// 	if (day < 10){
// 		day = '0' + day.toString();
// 	};
// 	if (hour < 10){
// 		hour = '0' + hour.toString();
// 	};
// 	if (min < 10){
// 		min = '0' + min.toString();
// 	};
// 	if (sek < 10){
// 		sek = '0' + sek.toString();
// 	};
	
	
// 	var timestamp = year.toString()+'-'+month+'-'+day+'T'+hour+':'+min+':'+sek;
	
// 	times.timestamp = timestamp;
// 	return times;
// }

app.post('/testPost', function (req, res){
	var data = '';
	req.on('data', function(chunk){
		data = JSON.parse(chunk);
		db.serialize(function() {				
			db.run("CREATE TABLE if not exists pictures (url TEXT)");
			var stmt = db.prepare("INSERT INTO pictures VALUES (?)");
			  stmt.run(data.url);
			stmt.finalize();
			db.each("SELECT url FROM pictures", function(err, row) {
			  console.log(row.url);
			});
		});
	});

    res.json('janne');
});


// ----------- styra IO portarna ------------------ 

app.post('/trigger', function (req,res) {
	console.log("nu ska lampan tändas");
		
	/*
	
	// ta bild med kameran
	var process_id = photo.start({
	mode: "photo", 
	w:640,
	output: "/home/pi/hemsida-bevattningssystem/public/images/hejja.jpg"});
	setTimeout(function(){
		console.log("nu pausar vi")
	}, 7000);
	//photo.stop(process_id);
	
	*/

	/*
	// blinka led
	var iv = setInterval(function(){
		led.writeSync(led.readSync() === 0 ? 1 : 0)
	}, 500);
 
	// Stop blinking the LED and turn it off after 5 seconds.
	setTimeout(function() {
	    clearInterval(iv); // Stop blinking
	    led.writeSync(0);  // Turn LED off.
	    led.unexport();    // Unexport GPIO and free resources
	}, 5000);
	*/

	console.log("Nu är det färdigblinkar");
	
});



app.listen(8080);

console.log("server running on port 8080");
