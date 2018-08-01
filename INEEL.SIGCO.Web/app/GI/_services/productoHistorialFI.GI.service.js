(function () {
    "use strict";
    angular
        .module("ineel.GI.services")
        .factory("productoHistorialFI", ["$http", "globalGet", productoHistorialFI]);

    function productoHistorialFI($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        service.GetAll = function () {
            var endPoint = API + "ProductoHistorialFI/GetAll";
            return $http.get(endPoint);
        }

        service.Create = function (registro) {
            var endpoint = API + "ProductoHistorialFI/Create";
            return $http.post(endpoint, registro);
        }

        service.GetHistorialByProducto = function (id) {
            var endPoint = API + "ProductoHistorialFI/GetHistorialByProducto/"+id;
            return $http.get(endPoint);
        }

        service.GetHistorialBySolicitud = function (id) {
            var endPoint = API + "ProductoHistorialFI/GetHistorialBySolicitud/" + id;
            return $http.get(endPoint);
        }

        service.AddComentario = function (obj) {
            var endPoint = API + "ProductoHistorialFI/AddComentario";
            return $http.put(endPoint, obj);
        }

        service.Update = function (registro) {
            var endpoint = API + "ProductoHistorialFI/Update";
            return $http.put(endpoint, registro);
        }

        service.Delete = function (id) {
            var endpoint = API + "ProductoHistorialFI/Delete/"+id;
            return $http.delete(endpoint);
        }

        service.GetJustificacionSolicitudRechazada = function (id) {
            var endpoint = API + "ProductoHistorialFI/GetJustificacionSolicitudRechazada/"+id;
            return $http.get(endpoint);
        }

        return service;

    }

})();