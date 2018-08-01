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
        .factory("tipocompetenciaService", ["$http", "globalGet", tipocompetenciaService]);

    function tipocompetenciaService($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        var API = globalGet.get("api");
        var service = {};


      
        service.getById = function (id) {
            var endpoint = API + "TipoCompetencia/GetById/" + id;
            return $http.get(endpoint);
        }

        
        service.getAll = function () {
            var endpoint = API + "TipoCompetencia/GetAll";
            return $http.get(endpoint);
        }

        service.getAllSinFiltro = function () {
            var endpoint = API + "TipoCompetencia/GetAllSinFiltro";
            return $http.get(endpoint);
        }
       
        service.Update = function (obj) {
            var endpoint = API + "TipoCompetencia/Update/" + obj;
            return $http.put(endpoint, obj);
        }

        // Create
        service.Add = function (obj) {
            var endpoint = API + "TipoCompetencia/Create/" + obj;
            return $http.post(endpoint, obj);
        }

        //Actualizar estado
        service.UpdateEstado = function (Registro) {
            var endPoint = API + "TipoCompetencia/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }


        return service;

    }

}());