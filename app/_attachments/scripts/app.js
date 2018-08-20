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

.controller("pokemonCtrl", function($scope, pokemonService){
    pokemonService.getAllPokemons().then(function(data){
		$scope.pokemons = data;
	});
})
.service('pokemonService', function($http, $q){
	this.getAllPokemons = function(){
		var q = $q.defer();
		
		$http.get("pokedex.json").then(function(data){
			var all = data.data;
			q.resolve(all);
		}, function(err){
			q.reject(err);
		});	
		
		return q.promise;
	};
})

.service("detailService", function($q, pokemonService){
	var q = $q.defer();
	this.getPokemonDetail = function(pokemon_id){
		return pokemonService.getAllPokemons().then(function(data){
			for(var i = 0; data.length; i++){
				if(data[i].id == pokemon_id){
					return data[i];
				};
			};
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