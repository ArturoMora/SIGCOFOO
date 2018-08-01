(function () {
    "use strict";
    angular
        .module("ineel.CH.services")
        .factory("InstitucionService", ["$http", "globalGet", InstitucionService]);

    function InstitucionService($http, globalGet) {
        //Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};
        //Obtener todos los registros 
        service.getAll = function () {
            var endPoint = API + "Institucion/GetAllAdmin";
            return $http.get(endPoint);
        }
        //Obtener  por id
        service.getById = function (id) {
            var endPoint = API + "Institucion/GetById/" + id;
            return $http.get(endPoint);
        }
        ////Actualizar 
        service.Update = function (Registro) {
            var endPoint = API + "Institucion/Update/" + Registro;
            return $http.put(endPoint, Registro);
        }

        //Agregar 
        service.Add = function (Registro) {
            var endPoint = API + "Institucion/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }

        //Agregar desde modal
        service.addfrommodal = function (Registro) {
            var endPoint = API + "Institucion/CreateFromModal/" + Registro;
            return $http.post(endPoint, Registro);
        }
        //Actualizar estado
        service.UpdateEstado = function (Registro) {
            var endPoint = API + "Institucion/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }

        //Obtener paises
        service.GetPaises = function () {
            var endPoint = API + "Pais/GetAll/";
            return $http.get(endPoint);
        }
        return service;
    }
})();