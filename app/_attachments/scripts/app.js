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

.controller("pokemonCtrl", function($scope, pokemonSrv, saveSrv){
	pokemonSrv.saveAllPokemonsToNewDatabase().then(function(data){
		for (var i = 0; i < data.length; i++) {
			saveSrv.setObject(data[i].name, data[i]);
		}		
	});	
	
	$("#getInfo").on("click", function(e){
		var pokemons = [];
		var startDate = $("#startDate").val();
		var endDate = $("#endDate").val();
		
		pokemonSrv.getAllDocs().then(function(data){
			for (var i = 0; i < data.length - 1; i++) {
				saveSrv.getObject(data[i].id).then(function(data){
					if (data.owned > startDate && data.owned < endDate) {		
						pokemons.push(data.name)
					}
				});
			}
		});
		$scope.pokemons = pokemons;
	});
	
})

.service('pokemonSrv', function($http, $q){
	this.saveAllPokemonsToNewDatabase = function(){
		var q = $q.defer();
		
		//Aan te passen door link van json
		var url = '../../../pokemon1/aa22c07fd07281e7bafa3147f40010fe/pokemon.json'
		
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

.service('saveSrv', function($http, $q){
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