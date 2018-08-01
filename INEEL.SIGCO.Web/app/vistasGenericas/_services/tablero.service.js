
(function () {
    "use strict";

    angular
        .module("ineel.controllers")
        .factory("tableroService", ["$http", "globalGet", tableroService]);

    function tableroService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        
        //OBTENER ACTUALIZACIONES DE LA FICHA CURRICULAR 
        service.getActualizacionesPerfil = function (id) {
            var endPoint = API + "IndicadoresCH/getActualizacionesPeriodo/" + id;
            return $http.get(endPoint);
        }


        //OBTENER ESTUDIOS POR COMUNIDAD DE PRACTICAS 
        service.getEstudiosComunidad = function (id) {
            var endPoint = API + "IndicadoresCP/getEstudiosComunidad/" + id;
            return $http.get(endPoint);
        }


        //OBTENER MAPAS POR COMUNIDAD DE PRACTICAS 
        service.getMapasComunidad = function (id) {
            var endPoint = API + "IndicadoresCP/getMapasComunidad/" + id;
            return $http.get(endPoint);
        }


        //OBTENER PARTICIPANTES POR COMUNIDAD DE PRACTICAS 
        service.getParticipantesComunidad = function (id) {
            var endPoint = API + "IndicadoresCP/getParticipantesComunidad/" + id;
            return $http.get(endPoint);
        }


        //OBTENER OPORTUNIDADES DE NEGOCIO CONCRETADAS 
        service.getOportunidades = function (id) {
            var endPoint = API + "IndicadoresCR/getOportunidadesConcretadas/" + id;
            return $http.get(endPoint);
        }

        //OBTENER PI LICENCIADA
        service.getpiLicencida = function (id) {
            var endPoint = API + "indicadoresPI/getpiLicenciada/" + id;
            return $http.get(endPoint);
        }


        //OBTENER PI LICENCIADA
        service.getpiLicencidaXInvestigador = function (id) {
            var endPoint = API + "indicadoresPI/getpiLicenciadaXInvestigador/" + id;
            return $http.get(endPoint);
        }


        //OBTENER PROPUESTAS ENTRE IDEAS APROBADAS GI
        service.getPropuestasEntreIdeas = function (id) {
            var endPoint = API + "IndicadoresGI/getPropuestraEntreIdeas/" + id;
            return $http.get(endPoint);
        }

        //OBTENER IDEAS ENTRE IDEAS APROBADAS GI
        service.getIdeasEntreIdeas = function (id) {
            var endPoint = API + "IndicadoresGI/getIdeasEntreIdeas/" + id;
            return $http.get(endPoint);
        }

        //AutorCapitulosExt
        service.getAccesosMT = function (id) {
            var endPoint = API + "AccesoModulos/getAccesos/" + id;
            return $http.get(endPoint);
        }

        return service;


    }

}());