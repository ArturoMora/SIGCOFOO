/*
AYUDA:
FooEntities.- la entidad en plural, e.j.: Empleados
FooID.-  es el ID del modelo (ID de la tabla)
FooController.- el controlador de WebAPI
FooEntitiesService nombre de factory en ENTITIES.service.js
"iie.services".- referencia a /app/_services/*.service.js
*/
(function () {
    "use strict";           
    angular
        .module("ineel.CH.services")
        .factory("tipoareaService", ["$http", "globalGet", tipoareaService]);
                            
    function tipoareaService($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
    	var API = globalGet.get("api");
    	var service = {};

    	// Get 
    	service.getAll = function () {
    		var endpoint = API + "TipoArea/getAll";
    		return $http.get(endpoint);
    	}

    	service.getAllSinFiltro = function () {
    	    var endpoint = API + "TipoArea/GetAllSinFiltro";
    	    return $http.get(endpoint);
    	}

    	// Update
    	service.update = function (obj) {
    		var endpoint = API + "TipoArea/Update/" + obj;
    		return $http.put(endpoint, obj);
    	}

    	// Create
    	service.add = function (obj) {
    		var endpoint = API + "TipoArea/Create/" + obj;
    		return $http.post(endpoint, obj);
    	}

    	service.getById = function (id) {
    	    var endpoint = API + "TipoArea/GetById/" + id;
    	    return $http.get(endpoint);
    	}

    	service.updateEstado = function (Registro) {
    	    var endPoint = API + "TipoArea/UpdateEstado/" + Registro;
    	    return $http.put(endPoint, Registro);
    	}

        return service;

    }

}());