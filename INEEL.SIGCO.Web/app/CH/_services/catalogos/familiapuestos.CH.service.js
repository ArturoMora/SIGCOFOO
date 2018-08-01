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
        .factory("familiapuestosService", ["$http", "globalGet", familiapuestosService]);

    function familiapuestosService($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        var API = globalGet.get("api");
        var service = {};

        // Get 
        service.getAll = function () {
            var endpoint = API + "FamiliasPuestos/GetAll" ;
            return $http.get(endpoint);
        }

        service.getAllSind = function () {
            var endpoint = API + "FamiliasPuestrosSind/GetAll";
            return $http.get(endpoint);
        }

        service.getById = function (id) {           
            var endpoint = API + "FamiliasPuestos/GetById/" + id;
            return $http.get(endpoint);
        }

        service.getByPeriodo = function (id) {
            var endpoint = API + "FamiliasPuestos/GetByPeriod/" + id;
            return $http.get(endpoint);
        }

        // Update
        service.update = function (obj) {
            var endpoint = API + "FamiliasPuestos/Update/" + obj;
            return $http.put(endpoint, obj);
        }

        // Create
        service.add = function (Registro) {
            var endpoint = API + "FamiliasPuestos/Create/";
            return $http.post(endpoint, Registro);
        }

        service.updateEstado = function (Registro) {
            var endPoint = API + "FamiliasPuestos/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }
       

        return service;

    }

}());