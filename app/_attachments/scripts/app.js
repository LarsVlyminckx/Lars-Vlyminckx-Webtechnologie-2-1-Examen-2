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
	pokemonSrv.saveAllPokemonsToNewDatabase().then(function(data){
		for (var i = 0; i < data.length; i++) {
			saveService.setObject(data[i].name, data[i]);
		}		
	});	
	
	$("#getInfo").on("click", function(e){
		var startDate = $("#startDate").val().toLowerCase();
		var endDate = $("#endDate").val().toLowerCase();
		
		pokemonSrv.getAllDocs().then(function(data){
			for (var i = 0; i < data.length - 1; i++) {
				saveService.getObject(data[i].id).then(function(data){
					if (data.owned > startDate && data.owned < endDate) {		
						console.log(data.name);
					}
				});
			}
		});
	});
	
})

.service('pokemonSrv', function($http, $q){
	this.saveAllPokemonsToNewDatabase = function(){
		var q = $q.defer();
		var url = 'http://127.0.0.1:5984/pokemon1/aa22c07fd07281e7bafa3147f40010fe/pokemon.json'
		
		$http.get(url).then(function(data){
			q.resolve(data.data.docs);
		}, function(err){
			q.reject(err);
		});	
		
		return q.promise;
	};
	this.getAllDocs = function(){
		var q = $q.defer();
		var url = '../../_all_docs';
		
		$http.get(url).then(function(data){
			q.resolve(data.data.rows);
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