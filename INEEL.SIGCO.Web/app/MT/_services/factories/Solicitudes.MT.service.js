(function () {
    "use strict";
    angular
        .module("ineel.MT.services")
        .factory("SolicitudesMTService", ["$http", "globalGet",SolicitudesMTService]);

    function SolicitudesMTService($http, globalGet) {
        //Inicializacion de variables
        var API = globalGet.get("api");
        var service = {};
        //Obtener todos los registros 
        service.getCountAll = function (id) {
            var endPoint = API + "CountSolicitudesMT/GetAll/"+id;
            return $http.get(endPoint);
        }
        service.getAllsolicitudesITF = function () {
            var endPoint = API + "Solicitud/getAllsolicitudesITF";
            return $http.get(endPoint);
        }
        
        service.SolicitudRevisionITF_ByAdminMT = function (id) {
            var endPoint = API + "InformeTecnicoFinal/SolicitudRevisionITF_ByAdminMT/" + id;
            return $http.get(endPoint);
        }
        service.SolicitudRevisionITF_GetByResponsableUO = function (id) {
            var endPoint = API + "InformeTecnicoFinal/SolicitudRevisionITF_GetByResponsableUO/" + id;
            return $http.get(endPoint);
        }

        service.GetAccesoITFByClaveUnidad = function (id) {
            var endPoint = API + "SolicitudAccesoITF/GetAccesoITFByClaveUnidad/" + id;
            return $http.get(endPoint);
        }

        service.AprobarAccesoITF = function (model) {
            var endPoint = API + "SolicitudAccesoITF/AprobarAccesoITF";
            return $http.post(endPoint,model);
        }
        service.RechazoCondicionalAccesoITF = function (model) {
            var endPoint = API + "SolicitudAccesoITF/RechazoCondicionalAccesoITF";
            return $http.post(endPoint, model);
        }
        service.DenegarAccesoITF = function (model) {
            var endPoint = API + "SolicitudAccesoITF/DenegarAccesoITF";
            return $http.post(endPoint, model);
        }
        service.GetAccesoITFByClaveEmpleado = function (claveEmpleado) {
            var endPoint = API + "SolicitudAccesoITF/GetAccesoITFByClaveEmpleado/" + claveEmpleado;
            return $http.get(endPoint);
        }
        return service;
    }
})();