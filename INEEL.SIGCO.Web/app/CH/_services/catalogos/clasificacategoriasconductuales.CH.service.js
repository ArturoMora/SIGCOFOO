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
        .factory("clasificacategoriasconductualesService", ["$http", "globalGet", clasificacategoriasconductualesService]);

    function clasificacategoriasconductualesService($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        //Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};

        // Get FooEntities
        service.getAll = function () {
            var endpoint = API + "ClasificaCategoriasConductuales/GetAll";
            return $http.get(endpoint);
        };

        // Get 
        service.getById = function (id) {
            var endpoint = API + "ClasificaCategoriasConductuales/GetById/" + id;
            return $http.get(endpoint);
        }

        // Get by year
        service.getByPeriodo = function (id) {
            var endpoint = API + "ClasificaCategoriasConductuales/GetByPeriodo/" + id;
            return $http.get(endpoint);
        };

        // Get by year
        service.getByFamilia = function (id) {
            var endpoint = API + "ClasificaCategoriasConductuales/GetByFamilia/" + id;
            return $http.get(endpoint);
        };

        // Get categorías de empleados
        service.getCategorias = function () {
            var endpoint = API + "ClasificaCategoriasConductuales/GetCategoriasEmpleados";
            return $http.get(endpoint);
        };

        // Update
        service.update = function (Registro) {
            var endpoint = API + "ClasificaCategoriasConductuales/Update";
            return $http.put(endpoint, Registro);
        }

        // Create
        service.add = function (Registro) {
            var endpoint = API + "ClasificaCategoriasConductuales/Create/" + Registro;
            return $http.post(endpoint, Registro);
        }

        //Actualizar estado
        service.updateEstado = function (Registro) {
            var endPoint = API + "ClasificaCategoriasConductuales/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }

        //eliminar registro 
        service.delete = function (id) {
            var endPoint = API + "ClasificaCategoriasConductuales/Delete/" + id;
            return $http.delete(endPoint, id);
        }

        return service;

    }

}());