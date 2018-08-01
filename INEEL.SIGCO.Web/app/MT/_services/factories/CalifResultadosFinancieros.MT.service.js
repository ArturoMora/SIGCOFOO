/*
AYUDA:
FooEntities.- la entidad en plural, e.j.: Empleados
FooID.-  es el ID del modelo (ID de la tabla)
FooController.- el controlador de WebAPI
CalifResultadosFinancieros nombre de factory en ENTITIES.service.js
"ineelMT.services".- referencia a /app/_services/*.service.js
*/
(function () {
    "use strict";
    
    var app = angular.module("ineel.MT.services");
    app.factory("CalifResultadosFinancierosService", ["$http", "globalGet", CalifResultadosFinancieros]);

    function CalifResultadosFinancieros($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        var API = globalGet.get("api");
        var service = {};

        // Get 
        service.getById = function (FooID) {
            var endpoint = API + "CalifResultadosFinancieros/getById/" + FooID;
            return $http.get(endpoint);
        }


        

        // Update
        service.Update = function (model) {
            var endpoint = API + "CalifResultadosFinancieros/update";
            return $http.put(endpoint, model);
        }


        // Create
        service.create = function (model) {
            var endpoint = API + "CalifResultadosFinancieros/create";
            return $http.post(endpoint, model);
        }

        // Get FooEntities
        service.getAll = function () {
            var endpoint = API + "CalifResultadosFinancieros/GetAll";
            return $http.get(endpoint);
        };


        //Actualizar estado
        service.UpdateEstado = function (Registro) {
            var endPoint = API + "CalifResultadosFinancieros/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }
        return service;

        // Delete
        service.delete = function (FooID) {
            var endpoint = API + "CalifResultadosFinancieros/delete/" + FooID;
            return $http.delete(endpoint);
        }

        return service;

    }

}());