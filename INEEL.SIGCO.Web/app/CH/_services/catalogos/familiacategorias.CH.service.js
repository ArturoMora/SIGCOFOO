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
        .factory("familiacategoriasService", ["$http", "globalGet", familiacategoriasService]);

    function familiacategoriasService($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        var API = globalGet.get("api");
        var service = {};

        // Get 
        service.getAll = function () {
            var endpoint = API + "CategoriasFamilia/GetAll";
            return $http.get(endpoint);
        }
                       
        service.GetCategoriaFamilia = function (id) {
            var endpoint = API + "CategoriasFamilia/GetCategoryFam/" + id;
            return $http.get(endpoint);
        }

        service.GetCategoriaFamiliaSind = function (id) {
            var endpoint = API + "CategoriasCompetenciasSind/GetCategoryFam/" + id;
            return $http.get(endpoint);
        }

        service.getById = function (id) {
            var endpoint = API + "CategoriasFamilia/GetById/" + id;
            return $http.get(endpoint);
        }

        service.getByPeriodo = function (id) {
            var endpoint = API + "CategoriasFamilia/GetCategoryByPeriod/" + id;
            return $http.get(endpoint);
        }

        // Update
        service.update = function (obj) {
            var endpoint = API + "CategoriasFamilia/Update/" + obj;
            return $http.put(endpoint, obj);
        }

        // Create
        service.add = function (Registro) {
            var endpoint = API + "CategoriasFamilia/Create/";
            return $http.post(endpoint, Registro);
        }

        service.updateEstado = function (Registro) {
            var endPoint = API + "CategoriasFamilia/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }
       

        return service;

    }

}());