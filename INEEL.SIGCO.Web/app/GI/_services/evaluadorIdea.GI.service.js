(function () {
    "use strict";
    angular
        .module("ineel.GI.services")
        .factory("EvaluadorIdeaService", ["$http", "globalGet", EvaluadorIdeaService]);

    function EvaluadorIdeaService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};


        service.UpdateComentarios = function (registro) {
            var endpoint = API + "EvaluadorIdea/UpdateComentarios";
            return $http.put(endpoint, registro);
        }

        service.getComentarios = function (id) {
            var endPoint = API + "EvaluadorIdea/GetComentarios/" + id;
            return $http.get(endPoint);
        }

        return service;

    }

})();