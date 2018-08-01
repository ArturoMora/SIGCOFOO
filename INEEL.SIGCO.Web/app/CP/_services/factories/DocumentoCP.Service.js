(function () {
    angular
        .module("ineel.CP.services")
        .factory("DocumentoCPService", [
            "$http",
            "globalGet",
            DocumentoCPService
        ]);


    function DocumentoCPService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        //GetAll documentos OC
        service.getAll = function () {
            var endpoint = API + "Documento/GetAll";
            return $http.get(endpoint);
        };

        //Get documentos OC
        service.getByComunidad = function (id) {
            var endpoint = API + "Documento/GetByComunidad/" + id;
            return $http.get(endpoint);
        }

        //Get documentos OC
        service.getByComunidad2 = function (id) {
            var endpoint = API + "Documento/GetByComunidad2/" + id;
            return $http.get(endpoint);
        }
      
        //Get documentos OC
        service.getByInvitadoComunidad = function (id) {
            var endpoint = API + "Documento/GetByInvitadoComunidad/" + id;
            return $http.get(endpoint);
        }

       

        //Get documentos OC
        service.getById = function (id) {
            var endpoint = API + "Documento/GetById/" + id;
            return $http.get(endpoint);
        }

        //Create
        service.create = function (obj) {
            var endpoint = API + "Documento/Create/" + obj;
            return $http.post(endpoint, obj);
        }

        //Update
        service.update = function (obj) {
            var endpoint = API + "Documento/Update";
            return $http.put(endpoint, obj);
        }

        //Delete
        service.delete = function (id) {
            var endpoint = API + "Documento/Delete/" + id;
            return $http.delete(endpoint);
        }

        //Delete
        service.deleteDoc = function (id) {
            var endpoint = API + "Documento/DeleteDoc/" + id;
            return $http.delete(endpoint);
        }

        //Update estadi documento 
        service.updateEstado = function (campo) {
            var endpoint = API + "Documento/UpdateEstado";
            return $http.put(endpoint, campo);
        }

        return service;
    }
})();