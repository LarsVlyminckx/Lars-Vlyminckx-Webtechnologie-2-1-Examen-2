'use strict'

angular.module('pokemonApp', ['ngRoute'])

.config(function($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'assets/views/home.html',
            controller: 'pokemonCtrl'
        })
        .otherwise({
            redirectTo: '/home'
        });
})

.controller("pokemonCtrl", function($scope, pokemonSrv, saveService){
	pokemonSrv.getAllPokemons().then(function(data){
		for (var i = 0; i < data.length; i++) {
			var pokemonName = data[i].name;
			var pokemon = data[i];
			saveService.setObject(data[i].name, data[i]);
		}		
	});	
	
	$("#getInfo").on("click", function(e){
		var startDate = $("#startDate").val().toLowerCase();
		var endDate = $("#endDate").val().toLowerCase();
		
		console.log(startDate);
		console.log(endDate);
		
		/*saveService.getObject(name).then(function(data){
			$scope.naam = name; 
			$scope.image = data.image;
			$scope.description = data.description;
			$scope.types = data.types;
			$scope.status = "This pokemon was already in the database."
			
		}, function(err){
			pokemonService.getAllPokemons().then(function(data){
				for(var i = 0; data.length; i++){
					if(data[i].name.toLowerCase() == name){
						var doc = {};
						doc.image = data[i].image;
						doc.description = data[i].description;
						doc.types = data[i].types;
						
						saveService.setObject(name, doc);
						
						$scope.naam = name; 
						$scope.image = data[i].image;
						$scope.description = data[i].description;
						$scope.types = data[i].types;
						$scope.status = "This pokemon is added to the database."
					};
				};
			});
		});*/
	});
	
})

.service('pokemonSrv', function($http, $q){
	this.getAllPokemons = function(){
		var q = $q.defer();
		var url = 'http://127.0.0.1:5984/pokemon1/aa22c07fd07281e7bafa3147f40010fe/pokemon.json'
		
		$http.get(url).then(function(data){
			q.resolve(data.data.docs);
		}, function(err){
			q.reject(err);
		});	
		
		return q.promise;
	};
})

.service('saveService', function($http, $q){
	this.setObject = function(key, value){
		$http.put("../../" + key, value);
	};
	
	this.getObject = function(key){
		var q = $q.defer();
		$http.get("../../" + key).then(function(data){
			q.resolve(data.data);
		}, function(err){
			q.reject(err);
		});
		return q.promise;
	}
});