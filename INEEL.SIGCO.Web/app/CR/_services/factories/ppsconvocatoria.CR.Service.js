(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("PPsConvocatoriaCRService", [
        "$http",
        "globalGet",
        PPsConvocatoriaCRService
        ]);

    function PPsConvocatoriaCRService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        // Get Convocatorias
        service.getConvocatorias = function () {
            var endpoint = API + "Convocatoria/GetAll";
            return $http.get(endpoint);
        };

        // Get Fondos ProgramaWithAllFKs
        service.getConvocatoriasAllFKs = function () {
            var endpoint = API + "Convocatoria/GetAllFKs/";
            return $http.get(endpoint);
        };

        // Get Fondos ProgramaWithAllFKs
        service.getConvocatoriaFKById = function (convocatoriaId) {
            var endpoint = API + "Convocatoria/GetFKById/" + convocatoriaId;
            return $http.get(endpoint);
        };

        // Get Fondos ProgramaWithAllFKsAndGerencia
        service.getConvFKByIdWithGerencia = function (convocatoriaId) {
            var endpoint = API + "Convocatoria/GetFKByIdWithGerencia/" + convocatoriaId;
            return $http.get(endpoint);
        };


        //Create Convocatoria
        service.createProyecto= function (convocatoria) {
            var endpoint = API + "ProyectoPorConvocatoria/create/" + convocatoria;
            return $http.post(endpoint, convocatoria);
        }

        //Create Convocatoria
        service.createPropuesta = function (convocatoria) {
            var endpoint = API + "PropuestaPorConvocatoria/create/" + convocatoria;
            return $http.post(endpoint, convocatoria);
        }

        //Update Convocatoria
        service.updateConvocatoria = function (convocatoria) {
            var endpoint = API + "Convocatoria/updateLecciones" ;
            return $http.put(endpoint, convocatoria);
        }

        //Obtener ResponsablePP
        service.responsablePP = function (id) {
            var endPoint = API + "Personas/GetById/" + id;
            return $http.get(endPoint);
        }

        // Update Convocatoria
        service.updatePPConvocatoria = function (convocatoria) {
            var endpoint = API + "Convocatoria/UpdatePPConvocatoria";
            return $http.put(endpoint, convocatoria);
        }

        //// Get Fondos ProgramaWithAllFKs
       
        //debugger;
        //Valida que no haya convocatorias registradas en las propuestas
        service.validaConvocatoria = function (convocatoriaId) {
            //debugger;
            var endpoint = API + "PropuestaPorConvocatoria/validaConvocatoria/" + convocatoriaId;
            return $http.get(endpoint);
        };
        //Valida que no haya convocatorias registradas en los proyectos
        service.validaConvocatoriaProy = function (convocatoriaId) {
            //debugger;
            var endpoint = API + "ProyectoPorConvocatoria/validaConvocatoria/" + convocatoriaId;
            return $http.get(endpoint);
        };
        //Valida que no haya el mismo proyecto registrado
        //service.validaConvocatoriaExist = function (convocatoria) {
        //    debugger;
        //    var endpoint = API + "ProyectoPorConvocatoria/validaExist/" + convocatoria;
        //    return $http.get(endpoint, convocatoria);
        //};

        //// Delete Convocatoria
        //service.delete = function (convocatoriaId) {
        //    var endpoint = API + "Convocatoria/Delete/" + convocatoriaId;
        //    return $http.delete(endpoint);
        //}

        ////Actualizar estado para el Eliminado Lógico
        //service.UpdateEstado = function (campo) {
        //    var endPoint = API + "Convocatoria/UpdateEstado/" + campo;
        //    return $http.put(endPoint, campo);

        //}

        //Obtener FondosProgramaByEstado
        service.fondosProgramaAllByEstado = function () {
            var endPoint = API + "FondosPrograma/GetAllByEstado";
            return $http.get(endPoint);
        }

        //Obtener Nombre de la unidad organizacional
        service.getNombreUnidad = function (UnidadId) {
            debugger;
            var endPoint = API + "UnidadOrganizacional/GetById/" + UnidadId;
            return $http.get(endPoint);
        }


        return service;
    }
}());
