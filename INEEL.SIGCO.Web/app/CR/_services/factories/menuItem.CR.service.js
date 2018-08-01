(function () {
    "use strict";
    
    angular
        .module("ineel.CR.services")
        .factory("menuItemCRService", [
        "$http",
        "globalGet",
        menuItemCRService
        ]);

    function menuItemCRService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        // GetAll
        service.getAll = function () {
            var endpoint = API + "menuItem/GetAll";
            return $http.get(endpoint);
        };

        // GetByParent
        service.GetByParent = function (menuItemId) {
            var endpoint = API + "menuItem/GetByParent/" + menuItemId;
            return $http.get(endpoint);
        }

        // Update
        service.update = function (model) {
            var endpoint = API + "menuItem/Update";
            return $http.put(endpoint, model);
        }

        // Create
        service.create = function (model) {
            var endpoint = API + "menuItem/Create/";
            return $http.post(endpoint, model);
        }

        // Delete
        service.delete = function (TipoRelacionId) {
            var endpoint = API + "menuItem/Delete/" + menuItemId;
            return $http.delete(endpoint);
        }



        return service;

    }

}());