myApp.controller('BilderController', ['$scope', '$http', function($scope, $http) {

		
		
		$http.get('/getPictureUrls').success(function(response){
			console.log("i got the data");
			$scope.urls = response;
		});	

	
	
	}]);
