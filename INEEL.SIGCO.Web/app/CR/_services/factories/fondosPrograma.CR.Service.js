(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("FondosProgramaCRService", [
            "$http",
            "globalGet",
            FondosProgramaCRService
        ]);

    function FondosProgramaCRService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        // Get FondoProgramaFKById
        service.getFondoProgramaFKById = function (fondoProgramaId) {
            var endpoint = API + "FondosPrograma/GetFKById/" + fondoProgramaId;
            return $http.get(endpoint);
        }

        // Update Fondos Programa
        service.update = function (fondoProgramaId) {
            var endpoint = API + "FondosPrograma/Update";
            return $http.put(endpoint, fondoProgramaId);
        }

        // Create Fondo Programa
        service.create = function (fondoPrograma) {
            var endpoint = API + "FondosPrograma/Create/" + fondoPrograma;
            return $http.post(endpoint, fondoPrograma);
        }
        // Create Fondo Programa
        service.createTematicaPorFondoPrograma = function (fondoPrograma) {
            var endpoint = API + "FondosPrograma/CreateTFP/" + fondoPrograma;
            return $http.post(endpoint, fondoPrograma);
        }

        //// Get Fondos Programa
        //service.getFondosPrograma = function () {
        //    var endpoint = API + "FondosPrograma/GetAll";
        //    return $http.get(endpoint);
        //};

        // Get Fondos ProgramaWithAllFKs
        service.getFondosProgramaAllFKs = function () {
            var endpoint = API + "FondosPrograma/GetAllFKs/";
            return $http.get(endpoint);
        };

        //Get fondo
        service.getFuenteByFondo = function (id) {
            var endpoint = API + "FondosPrograma/GetFuente/" + id;
            return $http.get(endpoint);
        };

        //Valida la duplicidad de fondos con proyectos y propuestas asociadas
        service.ValidaDuplicidad = function (id) {
            var endpoint = API + "FondosPrograma/ValidaDuplicidad/" + id;
            return $http.get(endpoint);
        };

        // Get Fondos ProgramaWithAllFKs por fuente
        service.getFondosAllFKsByfuente = function (fuenteId) {
            var endpoint = API + "FondosPrograma/GetAllByFuente/" + fuenteId;
            return $http.get(endpoint);
        };

        // Get detalles fondo con proyecto
        service.GetProyectosByFondo = function (fuenteId) {
            var endpoint = API + "FondosPrograma/GetProyectosByFondo/" + fuenteId;
            return $http.get(endpoint);
        };

        //Obtiene propuestas y proyectos por cada fondo de financiamiento
        service.getAllPPbyFondo = function () {
            var endpoint = API + "FondosPrograma/GetAllPP/";
            return $http.get(endpoint);
        }

        //Obtiene propuestas y proyectos por cada fondo de financiamiento
        service.getPP = function (id) {
            var endpoint = API + "FondosPrograma/GetPP/" + id;
            return $http.get(endpoint);
        }


        // Delete Fondo Programa
        service.delete = function (fondoProgramaId) {
            var endpoint = API + "FondosPrograma/Delete/" + fondoProgramaId;
            return $http.delete(endpoint);
        }

        // Delete Fondo Programa con tematicas
        service.DeleteFondoWithFKS = function (fondoProgramaId) {
            var endpoint = API + "FondosPrograma/DeleteFondoWithFKS/" + fondoProgramaId;
            return $http.delete(endpoint);
        }

        //eliminado logico del registro (activo => inactivo)
        service.UpdateEstado = function (campo) {
            var endPoint = API + "FondosPrograma/UpdateEstado/" + campo;
            return $http.put(endPoint, campo);
        }

        // Busqueda parametrizada de fondos programa
        service.GetConsultaParametrizadaFondo = function (param) {
            var endpoint = API + "FondosPrograma/GetConsultaParametrizadaFondo/" + param;
            return $http.post(endpoint, param);
        }

        //Obtiene el listado de empresas activas
        service.GetNombresEmpresa = function () {
            var endPoint = API + "Empresas/GetNombresEmpresa";
            return $http.get(endPoint);
        }

        //Obtiene el listado de fuentes de financiamiento
        service.GetNombresFuentesFinanciamiento = function () {
            var endPoint = API + "FuenteFinanciamiento/GetNombresFuentesFinanciamiento";
            return $http.get(endPoint);
        }

        service.getFuentesFinanciamiento = function () {
            var endPoint = API + "FuenteFinanciamiento/GetAll";
            return $http.get(endPoint);
        }

        service.getFuentesFinanciamientoActivas = function () {
            var endPoint = API + "FuenteFinanciamiento/GetAllActivas";
            return $http.get(endPoint);
        }

        service.getFuentesFinanciamientoEstado = function () {
            var endPoint = API + "FuenteFinanciamiento/GetAllByEstado";
            return $http.get(endPoint);
        }

        service.getAreasTematicasChecks = function () {
            var endPoint = API + "Tematica/GetAllByEstado";
            return $http.get(endPoint);
        }

        service.getAreasTematicasChecksEdit = function () {
            var endPoint = API + "Tematica/GetAllByEstadoE";
            return $http.get(endPoint);
        }
        //// Get AreasTematicasFKById
        //service.getAreasTematicasChecksFK = function (fondoProgramaId) {
        //    var endpoint = API + "FondosPrograma/GetTematicasFKById/" + fondoProgramaId;
        //    return $http.get(endpoint);
        //}
        service.getAreasTematicasCombo = function () {
            var endPoint = API + "Tematica/GetAllByEstado";
            return $http.get(endPoint);
        }

        service.getSitiosWebFP = function () {
            var endPoint = API + "SitioWebFondoPrograma/getAll";
            return $http.get(endPoint);
        }

        //Obtener FondosProgramaByEstado
        service.fondosProgramaAllByEstado = function () {
            var endPoint = API + "FondosPrograma/GetAllByEstado";
            return $http.get(endPoint);
        }

        //Obtener Nombre de la unidad organizacional
        service.getNombreUnidad = function (UnidadId) {
            var endPoint = API + "UnidadOrganizacional/GetById/" + UnidadId;
            return $http.get(endPoint);
        }

        //Elimina los proyectos/propuestas viejos por fondo 
        service.eliminaPPAnteriores = function (fondo) {
            var endPoint = API + "FondosPrograma/EliminaPPFondo/" + fondo;
            return $http.put(endPoint, fondo);
        }

        //Crea proyecto por fondo
        service.createProyecto = function (fondo) {
            var endpoint = API + "ProyectoPorFondo/create/" + fondo;
            return $http.post(endpoint, fondo);
        }

        //Crea propuesta por fondo
        service.createPropuesta = function (fondo) {
            var endpoint = API + "PropuestaPorFondo/create/" + fondo;
            return $http.post(endpoint, fondo);
        }

        // Get Tematicas no relacionadas a un fondo
        service.GetTematicasNotSelect = function (fondoId) {
            var endpoint = API + "Convocatoria/GetTematicasNotSelect/" + fondoId;
            return $http.get(endpoint);
        };


        //Registrar url
        service.registrarURL = function (obj) {
            var endpoint = API + "SitioWebFondoPrograma/Create/" + obj;
            return $http.post(endpoint, obj);
        }

        //Create persona actividad
        service.elimnaURL = function (id) {
            var endpoint = API + "SitioWebFondoPrograma/Delete/" + id;
            return $http.delete(endpoint, id);
        }

        ////elimina area actividad
        //service.eliminaArea = function (id) {
        //    var endpoint = API + "AreaActividadAdicional/Delete/" + id;
        //    return $http.delete(endpoint, id);
        //}

        //// Get SitiosWebFKById
        //service.getSitiosWebFPFK = function (fondoProgramaId) {
        //    var endpoint = API + "FondosPrograma/GetSitiosWebFKById/" + fondoProgramaId;
        //    return $http.get(endpoint);
        //}
        return service;

    }

}());