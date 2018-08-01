(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("EstudioMercadoService", [
        "$http",
        "globalGet",
        EstudioMercadoService
        ]);

    function EstudioMercadoService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        // Get Aliados
        service.getAll = function () {
            var endpoint = API + "EstudiosMercado/GetAll";
            return $http.get(endpoint);
        };
        service.add = function (registro) {
            var endpoint = API + "EstudiosMercado/Create/" + registro;
            return $http.post(endpoint, registro);
        }
        service.addAutores = function (registro) {
            var endpoint = API + "AutoresEstudioMercado/Create/" + registro;
            return $http.post(endpoint, registro);
        }

        service.GetConsultaParametrizadaEstudios = function (obj) {
            var endpoint = API + "EstudiosMercado/GetConsultaParametrizadaEstudios/" + obj;
            return $http.post(endpoint, obj);
        }

        service.delete = function (id) {
            var endPoint = API + "EstudiosMercado/Delete/" + id;
            return $http.delete(endPoint);
        }

        service.getById = function (id) {
            var endPoint = API + "EstudiosMercado/GetById/" + id;
            return $http.get(endPoint);
        }

        service.autores = function (id) {
            var endPoint = API + "AutoresEstudioMercado/GetById/" + id;
            return $http.get(endPoint);
        }

        //Update
        service.update = function (registro) {
            var endpoint = API + "EstudiosMercado/Update/" + registro;
            return $http.put(endpoint, registro);
        }

        service.add_Autores = function (registro) {
            var endpoint = API + "AutoresEstudioMercado/CreateUser/" + registro;
            return $http.post(endpoint, registro);
        }

        service.delete_Autor = function (id) {
            var endPoint = API + "AutoresEstudioMercado/DeleteAutor/" + id;
            return $http.delete(endPoint);
        }

        service.accesoArchivo = function (registro) {
            var endpoint = API + "EstudiosMercado/AccesoArchivo/" + registro;
            return $http.post(endpoint, registro);
        }


        service.graficaEstudiosMercado = function () {
            var endPoint = API + "EstudiosMercado/datosGrafica";
            return $http.get(endPoint);
        }


        return service;
    }

}());