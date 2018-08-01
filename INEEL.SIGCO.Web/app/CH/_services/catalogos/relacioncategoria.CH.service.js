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
        .factory("relacioncategoriaService", ["$http", "globalGet", relacioncategoriaService]);

    function relacioncategoriaService($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        var API = globalGet.get("api");
        var service = {};

        // Get 
        service.getAll = function () {
            var endpoint = API + "RelacionCategoria/getAll";
            return $http.get(endpoint);
        }

        service.getById = function (id) {
            var endpoint = API + "RelacionCategoria/GetById/" + id;
            return $http.get(endpoint);
        }

        // Update
        service.update = function (obj) {
            var endpoint = API + "RelacionCategoria/Update/" + obj;
            return $http.put(endpoint, obj);
        }

        // Create
        service.add = function (obj) {
            var endpoint = API + "RelacionCategoria/Create/" + obj;
            return $http.post(endpoint, obj);
        }

       

        return service;

    }

}());