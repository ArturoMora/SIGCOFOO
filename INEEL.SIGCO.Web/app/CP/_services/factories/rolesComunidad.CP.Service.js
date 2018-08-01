(function () {
    angular
        .module("ineel.CP.services")
        .factory("RolesCPService", [
            "$http",
            "globalGet",
            rolesCpService
        ]);


    function rolesCpService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        //GetAll roles OC
        service.getAll = function () {
            var endpoint = API + "RolesCP/GetAll";
            return $http.get(endpoint);
        };

        //Get roles OC
        service.getById = function (id) {
            var endpoint = API + "RolesCP/GetById/" + id;
            return $http.get(endpoint);
        }

        //Create
        service.create = function (categoria) {
            var endpoint = API + "RolesCP/Create/" + categoria;
            return $http.post(endpoint, categoria);
        }

        //Update
        service.update = function (categoria) {
            var endpoint = API + "RolesCP/Update";
            return $http.put(endpoint, categoria);
        }

        //Delete
        service.delete = function (id) {
            var endpoint = API + "RolesCP/Delete/" + id;
            return $http.delete(endpoint);
        }

        //Update EstadoRoles Sitio
        service.updateEstado = function (campo) {
            var endpoint = API + "RolesCP/UpdateEstado";
            return $http.put(endpoint, campo);
        }

        return service;
    }
})();