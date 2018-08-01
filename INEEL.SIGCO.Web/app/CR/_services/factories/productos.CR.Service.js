(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("ProductosCRService", [
            "$http",
            "globalGet",
            ProductosCRService
        ]);

    function ProductosCRService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        // Get Productos
        service.getProductos = function () {
            var endpoint = API + "Producto/GetAll";
            return $http.get(endpoint);
        };

        // Get Productos
        service.getProducto = function (productoId) {
            var endpoint = API + "Producto/Get/" + productoId;
            return $http.get(endpoint);
        }

        // Get Productos Para Modal
        service.getProductosModal = function (productos) {
            var endPoint = API + "Producto/GetProductosModal/";
            return $http.post(endPoint, productos);
        }
        
        //Create Productos
        service.create = function (producto) {
            var endpoint = API + "Producto/Create/" + producto;
            return $http.post(endpoint, producto);
        }

        // Update Productos
        service.update = function (producto) {
            var endpoint = API + "Producto/Update";
            return $http.put(endpoint, producto);
        }

        // Delete Productos
        service.delete = function (productoId) {
            var endpoint = API + "Producto/Delete/" + productoId;
            return $http.delete(endpoint);
        }

        //Actualizar estado para el Eliminado Lógico
        service.UpdateEstado = function (campo) {
            var endPoint = API + "Producto/UpdateEstado/" + campo;
            return $http.put(endPoint, campo);
        }

        return service;

    }

}());