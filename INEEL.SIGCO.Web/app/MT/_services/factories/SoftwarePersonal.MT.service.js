
﻿(function () {
    "use strict";

    var app = angular.module("ineel.MT.services");
    app.factory("softwarePersonalService", ["$http", "globalGet", softwarePersonalService]);

    function softwarePersonalService($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        var API = globalGet.get("api");
        var service = {};

        // Get 
        service.getById = function (FooID) {
            var endpoint = API + "softwarePersonal/getbyId/" + FooID;
            return $http.get(endpoint);
        }



        service.getAllByUsurio = function (clave) {
            var endpoint = API + "softwarePersonal/getAllByUsurio/"+clave;
            return $http.get(endpoint);
        };


        // Get FooEntities
        service.getAll = function () {
            var endpoint = API + "softwarePersonal/GetAll";
            return $http.get(endpoint);
        };



        // Delete
        service.delete = function (FooID) {
            var endpoint = API + "softwarePersonal/delete/" + FooID;
            return $http.delete(endpoint);
        }
        /////////////////////////OK:
        service.GetAllByStado = function (estado) {
            var endpoint = API + "softwarePersonal/GetAllByStado/"+estado;
            return $http.get(endpoint);
        };
        service.TipoSoftwareGetAllOrder = function () {
            var endpoint = API + "TipoSoftware/getAllOrder";
            return $http.get(endpoint);
        };
        service.getTipoAcceso = function () {
            var endpoint = API + "TipoAcceso/GetAllByEstadoDisponible";
            return $http.get(endpoint);
        }
        // Create
        service.create = function (model) {
            var endpoint = API + "softwarePersonal/create";
            return $http.post(endpoint, model);
        }
        service.GetByIdDetails = function (id) {
            var endpoint = API + "softwarePersonal/GetByIdDetails/" + id;
            return $http.get(endpoint);
        };

        // Update
        service.update = function (model) {
            var endpoint = API + "softwarePersonal/update";
            return $http.put(endpoint, model);
        }
        service.DeleteAutor = function (id) {
            var endpoint = API + "SoftwarePersonal/DeleteAutor/"+id
            return $http.post(endpoint, id);
        }

        service.AutorizaSWResponsableUnidad = function (id) {
            var endpoint = API + "SolicitudAcceso/AutorizaResponsableUnidad/" + id;
            return $http.post(endpoint);
        }
        
        service.updateEstado = function (Registro) {
            var endPoint = API + "softwarePersonal/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }

        service.AddSolicitud = function (Registro) {
            var endPoint = API + "Solicitud/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }

        service.AddBitacoraSolicitud = function (Registro) {
            var endPoint = API + "BitacoraSolicitudes/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }

        service.mailNotificacion = function (Registro) {
            var endPoint = API + "Correo/SendNotificacion?block=no";
            return $http.post(endPoint, Registro);
        }
        return service;

    }


}());