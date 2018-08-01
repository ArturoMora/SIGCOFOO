(function () {
    "use strict";
    angular
        .module("ineel.GI.services")
        .factory("bitacoraSolicitudService", ["$http", "globalGet", bitacoraSolicitudService]);

    function bitacoraSolicitudService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        service.AddBitacoraSolicitud = function (Registro) {
            var endPoint = API + "BitacoraSolicitudesGI/Create";
            return $http.post(endPoint, Registro);
        }

        service.getbyid = function (id, id2) {
            var endPoint = API + "BitacoraSolicitudesGI/GetById/" + id + "/" + id2;
            return $http.get(endPoint);
        }

        service.getbyidAprobadaAntes = function (id, id2) {
            var endPoint = API + "BitacoraSolicitudesGI/getbyidAprobadaAntes/" + id + "/" + id2;
            return $http.get(endPoint);
        }

        service.GetEstadoAprobadaByInfo = function (id, id2) {
            var endPoint = API + "BitacoraSolicitudesGI/GetEstadoAprobadaByInfo/" + id + "/" + id2;
            return $http.get(endPoint);
        }

        service.GetJustificacionSolicitudRechazada = function (id) {
            var endPoint = API + "Propuesta/GetJustificacionSolicitudRechazada/" + id;
            return $http.get(endPoint);
        }

        service.GetJustificacionSolicitudAceptada = function (id) {
            var endPoint = API + "Propuesta/GetJustificacionSolicitudAceptada/" + id;
            return $http.get(endPoint);
        }

        service.GetJustificacionSolicitudAModificar = function (id) {
            var endPoint = API + "Propuesta/GetJustificacionSolicitudAModificar/" + id;
            return $http.get(endPoint);
        }

        service.GetJustificacionPlanAceptado = function (id) {
            var endPoint = API + "PlanNegocioEvolutivo/GetJustificacionPlanAceptado/" + id;
            return $http.get(endPoint);
        }

        service.GetComentariosSolicitudIndividualPlan = function (id) {
            var endPoint = API + "PlanNegocioEvolutivo/GetComentariosSolicitudIndividualPlan/" + id;
            return $http.get(endPoint);
        }

        service.GetJustificacionSolicitud = function (model) {
            var endPoint = API + "BitacoraSolicitudesGI/GetJustificacionSolicitud";
            return $http.post(endPoint, model);
        }

        return service;

    }

})();