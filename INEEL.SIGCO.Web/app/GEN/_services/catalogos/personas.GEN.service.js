
(function () {
    "use strict";
    
    angular
        .module("ineel.GEN.services")
        .factory("personasService", ["$http", "globalGet", personasService]);

    function personasService($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        var API = globalGet.get("api"); 
        var service = {};

        // Get all registers
        service.getAll = function () {
            var endPoint = API + "Personas/getAll";
            return $http.get(endPoint);
        }
        //Obtener ambito por id
        service.getById = function (id) {
            var endPoint = API + "Personas/GetById/" + id;
            return $http.get(endPoint);
        }

        service.GetByArea = function (id) {
            var endPoint = API + "Personas/GetByArea/" + id;
            return $http.get(endPoint);
        }

        ////Actualizar ambito
        service.Update = function (obj) {
            var endPoint = API + "Personas/Update/" + obj;
            return $http.put(endPoint, obj);
        }
        //Agregar ambito
        service.Add = function (obj) {
            var endPoint = API + "Personas/Create/" + obj;
            return $http.post(endPoint, obj);
        }
        //by ACH:
        //Agregar ambito
        service.GetPersonas = function (personas) {
            var endPoint = API + "Personas/GetPersonas/";
            return $http.post(endPoint, personas);
        }

        //Actualizar estado
        service.UpdateEstado = function (Registro) {
            var endPoint = API + "Personas/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }

        return service;


    }

}());