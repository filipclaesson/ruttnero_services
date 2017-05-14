myApp.controller('BilderController', ['$scope', '$http', function($scope, $http) {

		
		
		$http.get('/getPictureUrls').success(function(response){
			console.log("i got the data");
			console.log(response.data)
			$scope.urls = response;
		});	

	
	
	}]);
