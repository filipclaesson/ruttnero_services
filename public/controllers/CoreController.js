var myApp = angular.module('myApp', ['ngRoute']);
myApp.controller('CoreController', ['$scope', '$http', function($scope, $http) {
    console.log("Hello World from controller");
	
	$scope.isDeveloper = false;
	$scope.getPicUrls = true;
	


	
	$scope.takePhoto = function(){
		
		$http.get('/takePicture').success(function(response){
			$scope.photoUrl = response;
			console.log("fick tillbaka photoUrl: " + response.dyn);

		});
	};
	
	
	
	
	


	$scope.testPost = function(){
		var picture = {
			url: $scope.inputTest,
			fille: 'hejhej' }
		$http.post('/testPost', picture).succcess(function(response){
		
		$scope.yay = response;	
		});
	};


	$http.get('/exempel').success(function(response){
		console.log("i got the data");
		$scope.exempel = response;
	});






    
}]).config(function($routeProvider){
	$routeProvider.when('/hej',
		{
			templateUrl: 'modules/views/hej.html'
		})
		.when('/bilder',
		{
			templateUrl: 'modules/views/bilder.client.html'
			
		})
		.when('/',
		{
			templateUrl: 'modules/views/hem.client.html'
		})
	
	});
