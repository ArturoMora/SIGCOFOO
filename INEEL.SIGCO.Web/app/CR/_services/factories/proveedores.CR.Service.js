(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("ProveedoresCRService", [
        "$http",
        "globalGet",
        ProveedoresCRService
        ]);

    function ProveedoresCRService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        // Get Proveedores
        service.getProveedores = function () {
            var endpoint = API + "Proveedor/GetAll";
            return $http.get(endpoint);
        };

        // Get ProveedorById
        service.getProveedor = function (proveedorId) {
            var endpoint = API + "Proveedor/Get/" + proveedorId;
            return $http.get(endpoint);
        }

        //Create Proveedor
        service.create = function (proveedor) {
            var endpoint = API + "Proveedor/Create/" + proveedor;
            return $http.post(endpoint, proveedor);
        }

        // Update AreasInvestigacion
        service.update = function (proveedor) {
            var endpoint = API + "Proveedor/Update";
            return $http.put(endpoint, proveedor);
        }

        // Delete Proveedor
        service.delete = function (proveedorId) {
            var endpoint = API + "Proveedor/Delete/" + proveedorId;
            return $http.delete(endpoint);
        }

        //Actualizar estado para el Eliminado Lógico
        service.UpdateEstado = function (campo) {
            var endPoint = API + "Proveedor/UpdateEstado/" + campo;
            return $http.put(endPoint, campo);
        }

        return service;
    }

}());