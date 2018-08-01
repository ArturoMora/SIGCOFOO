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
        .factory("clasificacategoriastecnicasService", ["$http", "globalGet", clasificacategoriastecnicasService]);

    function clasificacategoriastecnicasService($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        //Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};

        // Get FooEntities
        service.getAll = function () {
            var endpoint = API + "ClasificaCategoriasTecnicas/GetAll";
            return $http.get(endpoint);
        };

        // Get 
        service.getById = function (id) {
            var endpoint = API + "ClasificaCategoriasTecnicas/GetById/" + id;
            return $http.get(endpoint);
        }

        // Get by year
        service.getByPeriodo = function (id) {
            var endpoint = API + "ClasificaCategoriasTecnicas/GetByPeriodo/" + id;
            return $http.get(endpoint);
        };

        // Get by tipo
        service.getByTipo = function (obj) {
            var endpoint = API + "ClasificaCategoriasTecnicas/GetByTipo/" + obj;
            return $http.post(endpoint,obj);
        };

        // Get categorías de empleados
        service.getCategorias = function () {
            var endpoint = API + "ClasificaCategoriasTecnicas/GetCategoriasEmpleados";
            return $http.get(endpoint);
        };

        // Update
        service.update = function (Registro) {
            var endpoint = API + "ClasificaCategoriasTecnicas/Update";
            return $http.put(endpoint, Registro);
        }

        // Create
        service.add = function (Registro) {
            var endpoint = API + "ClasificaCategoriasTecnicas/Create/" + Registro;
            return $http.post(endpoint, Registro);
        }

        //Actualizar estado
        service.updateEstado = function (Registro) {
            var endPoint = API + "ClasificaCategoriasTecnicas/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }

        //eliminar registro 
        service.delete = function (id) {
            var endPoint = API + "ClasificaCategoriasTecnicas/Delete/" + id;
            return $http.delete(endPoint, id);
        }

        return service;

    }

}());