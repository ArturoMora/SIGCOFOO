(function () {
    "use strict";
    angular
        .module("ineel.GI.services")
        .factory("IdeainnovadoraService", ["$http", "globalGet", IdeainnovadoraService]);

    function IdeainnovadoraService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        service.get = function () {
            var endPoint = API + "IdeaInnovadora/GetAll";
            return $http.get(endPoint);
        }

        service.getAllAceptadas = function () {
            var endPoint = API + "IdeaInnovadora/getAllAceptadas";
            return $http.get(endPoint);
        }
        service.getAllAceptadas2 = function () {
            var endPoint = API + "IdeaInnovadora/getAllAceptadas2";
            return $http.get(endPoint);
        }

        service.getbyclave = function (clave) {
            var endPoint = API + "IdeaInnovadora/GetByClave/" + clave;
            return $http.get(endPoint);
        }

        service.ComentariosSolicitudIdea = function (clave) {
            var endPoint = API + "IdeaInnovadora/ComentariosSolicitudIdea/" + clave;
            return $http.get(endPoint);
        }

        service.ComentariosSolicitudAModificar = function (clave) {
            var endPoint = API + "IdeaInnovadora/ComentariosSolicitudAModificar/" + clave;
            return $http.get(endPoint);
        }

        service.ComentariosSolicitudAprobadaIdea = function (clave) {
            var endPoint = API + "IdeaInnovadora/ComentariosSolicitudAprobadaIdea/" + clave;
            return $http.get(endPoint);
        }

        service.GetConsultaIdeas = function (obj) {
            var endPoint = API + "IdeaInnovadora/GetConsultaIdeas/" + obj;
            return $http.post(endPoint,obj);
        }

        service.GetPermisoEdicion = function (obj) {
            var endPoint = API + "SolicitudGI/GetPermisoEdicion/" + obj;
            return $http.post(endPoint,obj);
        }

        service.getbyid = function (id) {
            var endPoint = API + "IdeaInnovadora/GetById/" + id;
            return $http.get(endPoint);
        }

        service.delete = function (Id) {
            debugger;
            var endPoint = API + "IdeaInnovadora/Delete/" + Id;
            return $http.delete(endPoint);
        }

        service.add = function (registro) {
            var endpoint = API + "IdeaInnovadora/Create";
            return $http.post(endpoint, registro);
        }

        service.update = function (registro) {
            var endpoint = API + "IdeaInnovadora/Update";
            return $http.put(endpoint, registro);
        }

        service.updateEstado = function (registro) {
            var endpoint = API + "IdeaInnovadora/UpdateEstado";
            return $http.put(endpoint, registro);
        }

        service.updateTipoAcceso = function (registro) {
            var endpoint = API + "IdeaInnovadora/UpdateTipoAcceso";
            return $http.put(endpoint, registro);
        }

        service.Persona = function (clave) {
            var endPoint = API + "Personas/GetByClave/" + clave;
            return $http.get(endPoint);
        }

        service.getAllContribucion = function () {
            var endPoint = API + "IdeaInnovadora/GetAllContribucion";
            return $http.get(endPoint);
        }

        service.getProponentes = function (id) {
            var endPoint = API + "IdeaInnovadora/GetProponentes/" + id;
            return $http.get(endPoint);
        }


        service.grupoevaluadorexist = function (id) {
            var endPoint = API + "IdeaInnovadora/GetGrupoEvaluadoExist/" + id;
            return $http.get(endPoint);
        }

        service.Persona = function (clave) {
            var endPoint = API + "Personas/GetByClave/" + clave;
            return $http.get(endPoint);
        }

        service.getDetailsAcceso = function (idReg, claveEmpleado) {
            var endPoint = API + "IdeaInnovadora/EvidenciaDownload/" + idReg + "/" + claveEmpleado;
            return $http.get(endPoint);
        }


        return service;

    }

})();