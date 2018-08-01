
(function () {
    "use strict";
    
    angular
        .module("ineel.GEN.services")
        .factory("funcionesService", ["$http", "globalGet", funcionesService]);

    function funcionesService($http, globalGet) { 
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        var API = globalGet.get("api");
        var service = {};

        // Get all registers
        service.getAll = function () {
            var endPoint = API + "Funciones/getAll";
            return $http.get(endPoint);
        }
        //Obtener ambito por id
        service.getById = function (id) {
            var endPoint = API + "Funciones/GetById/" + id;
            return $http.get(endPoint);
        }
        
        service.Update = function (obj) {
            var endPoint = API + "Funciones/Update/" + obj;
            return $http.put(endPoint, obj);
        }
       
        service.Add = function (obj) {
            var endPoint = API + "Funciones/Create/" + obj;
            return $http.post(endPoint, obj);
        }

        service.getByModulo = function (id) {
          
            var endPoint = API + "Funciones/GetByModulo/" + id;
            return $http.get(endPoint);
        }

        service.getFunByModulo = function (id) {
            var endPoint = API + "Funciones/GetFunByModulo/" + id;
            return $http.get(endPoint);
        }

        service.getFunByModuloRol = function (obj) {

            var endPoint = API + "Funciones/GetFunByModuloRol/";
            return $http.post(endPoint, obj);
        }


        service.getFunByModuloRol = function (obj) {

            var endPoint = API + "Funciones/GetFunByModuloRol/";
            return $http.post(endPoint, obj);
        }

        service.getFuncionPadre = function (id) {
            var endPoint = API + "Funciones/GetFuncionPadre/" + id;
           
            return $http.get(endPoint);
        }

        //Actualizar estado
        service.UpdateEstado = function (Registro) {
            var endPoint = API + "Funciones/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }

        service.prueba = function (obj) {
            var endPoint = API + "Funciones/PRUEBA/" +obj;
            return $http.get(endPoint);
        }

        return service;
    }

}());