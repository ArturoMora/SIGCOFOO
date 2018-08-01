(function () {
    angular
        .module("ineel.CP.services")
        .factory("AgendaCPService", [
            "$http",
            "globalGet",
            AgendaCPService
        ]);


    function AgendaCPService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

       
        service.getAll = function () {
            var endpoint = API + "AgendaCP/GetAll";
            return $http.get(endpoint);
        };

        //Get CategoriasCP byID
        service.GetById = function (id) {
            var endpoint = API + "AgendaCP/GetById/" + id;
            return $http.get(endpoint);
        }

        service.getByComunidad = function (id) {
            var endpoint = API + "AgendaCP/GetByComunidad/" + id;
            return $http.get(endpoint);
        }

        //Create CategoriasCP
        service.create = function (obj) {
            var endpoint = API + "AgendaCP/Create/" + obj;
            return $http.post(endpoint, obj);
        }

        //Create CategoriasCP
        service.registrayRecupera = function (obj) {
            var endpoint = API + "AgendaCP/RegistrayRecupera/" + obj;
            return $http.post(endpoint, obj);
        }

        //Update CategoriaCP
        service.update = function (obj) {
            var endpoint = API + "AgendaCP/Update";
            return $http.put(endpoint, obj);
        }

        //Delete CategoriaCP
        service.delete = function (id) {
            var endpoint = API + "AgendaCP/Delete/" + id;
            return $http.delete(endpoint);
        }

        //Update EstadoCategoriaCP
        service.updateEstado = function (campo) {
            var endpoint = API + "AgendaCP/UpdateEstado";
            return $http.put(endpoint, campo);
        }

        ///Correos
        service.mailNotificacion = function (Registro) {
            var endPoint = API + "Correo/SendNotificacion/" + Registro;
            return $http.post(endPoint, Registro);
        }

        return service;
    }
})();