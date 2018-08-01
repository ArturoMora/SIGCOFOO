/*
AYUDA:
FooEntities.- la entidad en plural, e.j.: Empleados
FooID.-  es el ID del modelo (ID de la tabla)
FooController.- el controlador de WebAPI
FooEntitiesService nombre de factory en ENTITIES.service.js
"iie.services".- referencia a /app/_services/*.service.js
*/
(function () {
    "use strict";
    angular
        .module("ineel.CH.services")
        .factory("nivelcompetenciatecnicaService", ["$http", "globalGet", nivelcompetenciatecnicaService]);

    function nivelcompetenciatecnicaService($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        //Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};    

        service.getById = function (id) {
            var endpoint = API + "NivelCompetenciaTecnica/GetById/" + id;
            return $http.get(endpoint);
        }

        // Update
        service.update = function (Registro) {
            var endpoint = API + "NivelCompetenciaTecnica/Update/";
            return $http.put(endpoint, Registro);
        }

        // Create
        service.add = function (Registro) {
            var endpoint = API + "NivelCompetenciaTecnica/Create/";
            return $http.post(endpoint, Registro);
        }

        service.getByPeriodoAndArea = function (Registro) {
            var endpoint = API + "NivelCompetenciaTecnica/GetByPeriodoAndArea/";
            return $http.post(endpoint, Registro);
        }

        service.getAll = function () {
            var endpoint = API + "NivelCompetenciaTecnica/GetAll";
            return $http.get(endpoint);
        };

        service.getByPeriodo = function (id) {          
            var endpoint = API + "NivelCompetenciaTecnica/GetByPeriodo/" + id;
            return $http.get(endpoint);
        };

        service.updateEstado = function (Registro) {
            var endPoint = API + "NivelCompetenciaTecnica/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }


        return service;

    }

}());