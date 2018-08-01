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
        .factory("matrizcompetenciasService", ["$http", "globalGet", matrizcompetenciasService]);

    function matrizcompetenciasService($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        var API = globalGet.get("api");
        var service = {};

        service.getAll = function () {
            var endpoint = API + "MatrizCompetencias/GetAll";
            return $http.get(endpoint);
        }
      
        service.getMatriz = function (id) {
            var endpoint = API + "MatrizCompetencias/GetMatriz/" + id;
            return $http.get(endpoint,id);
        }


        service.getMatrizSind = function (id) {
            var endpoint = API + "MatrizCompetenciasSind/getCompetencias/" + id;
            return $http.get(endpoint, id);
        }

        service.getById = function (id) {
            var endpoint = API + "MatrizCompetencias/GetById/" + id;
            return $http.get(endpoint,id);
        }

        service.getNivelSeleccionado = function (obj) {
            var endpoint = API + "MatrizCompetencias/GetNivelSeleccionado/" + obj;
            return $http.post(endpoint, obj);
        }

        // Update
        service.update = function (obj) {
            var endpoint = API + "MatrizCompetencias/Update/" + obj;
            return $http.put(endpoint, obj);
        }

        // Create
        service.add = function (obj) {
            var endpoint = API + "MatrizCompetencias/Create/" + obj;
            return $http.post(endpoint, obj);
        }

        //Actualizar estado
        service.updateEstado = function (Registro) {
            var endPoint = API + "MatrizCompetencias/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }

        //eliminar registro 
        service.delete = function (id) {
            var endPoint = API + "MatrizCompetencias/Delete/" + id;
            return $http.delete(endPoint, id);
        }

        return service;

    }

}());