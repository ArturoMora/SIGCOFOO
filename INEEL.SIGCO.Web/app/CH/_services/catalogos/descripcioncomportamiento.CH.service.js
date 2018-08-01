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
        .factory("descripcioncomportamiento", ["$http", "globalGet", descripcioncomportamiento]);

    function descripcioncomportamiento($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        var API = globalGet.get("api");
        var service = {};

        // Get 
        service.getAll = function () {
            var endpoint = API + "DesNivelComportamiento/getAll";
            return $http.get(endpoint);
        }

        service.getById = function (id) {
            var endpoint = API + "DesNivelComportamiento/GetById/" + id;
            return $http.get(endpoint);
        }

        service.getByPeriodo = function (id) {
            var endpoint = API + "DesNivelComportamiento/GetByPeriod/" + id;
            return $http.get(endpoint);
        }

        service.getByNivel = function (obj) {       
            var endpoint = API + "DesNivelComportamiento/GetByNivel/" + obj;
            return $http.post(endpoint,obj);
        }

        // Update
        service.update = function (obj) {
            var endpoint = API + "DesNivelComportamiento/Update/" + obj;
            return $http.put(endpoint, obj);
        }

        // Create
        service.add = function (obj) {
            var endpoint = API + "DesNivelComportamiento/Create/" + obj;
            return $http.post(endpoint, obj);
        }

        service.updateEstado = function (Registro) {
            var endPoint = API + "DesNivelComportamiento/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }

        return service;

    }

}());