(function () {
    "use strict";
    angular
        .module("ineel.CH.services")
        .factory("InventarioRH", ["$http", "globalGet", InventarioRH]);

    function InventarioRH($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};
        service.getUnidadById = function (id) {
            var endPoint = API + "UnidadOrganizacional/GetById/"+id;
            return $http.get(endPoint);
        }
        service.getdivision = function (unidadorganizacional) {
            var endPoint = API + "UnidadOrganizacional/GetAllnodes";
            return $http.post(endPoint, unidadorganizacional);
        }
        service.getgerencia = function (claveunidad) {
            var endPoint = API + "UnidadOrganizacional/GetAllnodes/" + claveunidad;
            return $http.get(endPoint);
        }

        service.getInformacion = function (parametrosconsulta) {
            var endPoint = API + "InventarioRH/GetByUnidadOrganizacional";
            return $http.post(endPoint, parametrosconsulta);
        }

        service.getpersonalinvestigacion = function (Personalinvestigacion) {
            var endPoint = API + "InventarioRH/ConsultaPersonalInvestigacion";
            return $http.post(endPoint, Personalinvestigacion);
        }

        service.getpersonalsni = function (parametrosconsulta) {
            var endPoint = API + "InventarioRH/ConsultaPersonalSNI";
            return $http.post(endPoint, parametrosconsulta);
        }
        service.getpersonalsnidatos = function (parametrosconsulta) {
            var endPoint = API + "InventarioRH/ConsultaPersonalSNIDatos";
            return $http.post(endPoint, parametrosconsulta);
        }

        service.getpersonalsniArea = function (parametrosconsulta) {
            var endPoint = API + "InventarioRH/ConsultaPersonalSNIArea";
            return $http.post(endPoint, parametrosconsulta);
        }

        service.getpersonalestudios = function (parametrosconsulta) {
            var endPoint = API + "InventarioRH/ConsultaPeronalEstudios";
            return $http.post(endPoint, parametrosconsulta);
        }

        service.getpersonalestudiosxfecha = function (parametrosconsulta) {
            var endPoint = API + "InventarioRH/ConsultaPersonalEstudiosxFecha";
            return $http.post(endPoint, parametrosconsulta);
        }

        service.getpersonalvigente = function (parametrosconsulta) {
            var endPoint = API + "InventarioRH/ConsultaPeronalVigente";
            return $http.post(endPoint, parametrosconsulta);
        }

        service.getpersonalvigentexfecha = function (parametrosconsulta) {
            var endPoint = API + "InventarioRH/ConsultaPersonalVigentexFecha";
            return $http.post(endPoint, parametrosconsulta);
        }

        service.getanalisissni = function (parametrosconsulta) {
            var endPoint = API + "InventarioRH/ConsultaAnalisisSNI";
            return $http.post(endPoint, parametrosconsulta);
        }

        service.getanalisissnixfecha = function (parametrosconsulta) {
            var endPoint = API + "InventarioRH/ConsultaAnalisisSNIxFECHA";
            return $http.post(endPoint, parametrosconsulta);
        }

        service.informacion = function (fecha) {
            var endPoint = API + "InventarioRH/EdadPromedio/" + fecha;
            return $http.get(endPoint);
        }

        service.informacionPerfilCurricular = function (fecha) {
            var endPoint = API + "InventarioRH/PerfilCurricular/" + fecha;
            return $http.get(endPoint);
        }
        service.informaciongradossni = function (fecha) {
            var endPoint = API + "InventarioRH/GradosSNI/" + fecha;
            return $http.get(endPoint);
        }
        service.getorganigrama = function (unidadorganizacional) {
            var endPoint = API + "UnidadOrganizacional/GetAllnodesFechaEfectiva";
            return $http.post(endPoint, unidadorganizacional);
        }

        service.consultarplantilla = function(fecha){
            var endPoint = API + "InventarioRH/ConsultaEvolucionPlantilla";
            return $http.post(endPoint,fecha);
        }
        service.piramide = function (fecha) {
            var endPoint = API + "InventarioRH/piramidecategoias/" + fecha;
            return $http.get(endPoint);
        }
        service.investigadoresgerencia = function (fecha) {
            var endPoint = API + "InventarioRH/investigadoresgerencia/" + fecha;
            return $http.get(endPoint);
        }
        service.investigadoresdisciplina = function (fecha) {
            var endPoint = API + "InventarioRH/investigadoresdisciplina/" + fecha;
            return $http.get(endPoint);
        }
        service.composicionespescialidades = function (fecha) {
            var endPoint = API + "InventarioRH/composicionespescialidades/" + fecha;
            return $http.get(endPoint);
        }
        service.movimientospersonal = function (objeto) {
            var endPoint = API + "Personas/MovimientosPersonal";
            return $http.post(endPoint, objeto);
        }
        return service;

    }

})();