(function() {
    "use strict";
    angular
        .module("ineel.MT.services")
        .factory("TipoInsumoService", ["$http", "globalGet", TipoInsumoService]);
    
    function TipoInsumoService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        //Obtener todos los registros
        service.getAll=function() {
            var endPoint = API + "TipoInsumo/GetAll";
            return $http.get(endPoint);
        }

        //Obtener por id
        service.getById=function(id) {
            var endPoint = API + "TipoInsumo/Get/"+id;
            return $http.get(endPoint);
        }

        //Actualizar
        service.Update=function(registro) {
            var endPoint = API + "TipoInsumo/Update/" + registro;
            return $http.put(endPoint, registro);
        }

        //Agregar
        service.Add=function(registro) {
            var endPoint = API + "TipoInsumo/Create/" + registro;
            return $http.post(endPoint, registro);
        }

        //ActualizarEstado
        service.UpdateEstado = function (registro) {
            var endPoint = API + "TipoInsumo/UpdateEstado/" + registro;
            return $http.put(endPoint, registro);
        }
        return service;
        
    }
})();