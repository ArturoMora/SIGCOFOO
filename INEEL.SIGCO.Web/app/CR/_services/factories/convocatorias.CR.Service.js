(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("ConvocatoriasCRService", [
            "$http",
            "globalGet",
            ConvocatoriasCRService
        ]);

    function ConvocatoriasCRService($http, globalGet) {
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
        service.getConvocatoriasAllFKsPP = function () {
            var endpoint = API + "Convocatoria/GetAllFKsPP/";
            return $http.get(endpoint);
        };

        // Get Fondos ProgramaWithAllFKs
        service.getConvocatoriasAllFKsByEstado = function () {
            var endpoint = API + "Convocatoria/GetAllFKsByEstado/";
            return $http.get(endpoint);
        };

        //Obtiene convocatorias vigentes
        service.getconvocatoriasvigentes = function () {
            var endpoint = API + "Convocatoria/GetConvocatoriasVigentes/";
            return $http.get(endpoint);
        };
        // Get Contactos Para Modal
        service.getConvocatoriasModal = function (convocatorias) {
            var endPoint = API + "Convocatoria/GetConvocatoriasModal/";
            return $http.post(endPoint, convocatorias);
        }

        // Get Fondos ProgramaWithAllFKs
        service.getByFondo = function (fondoId) {
            var endpoint = API + "Convocatoria/GetAllByFondo/" + fondoId;
            return $http.get(endpoint);
        };

        // Get Fondos ProgramaWithAllFKs
        service.getConvocatoriaFKById = function (convocatoriaId) {
            var endpoint = API + "Convocatoria/GetFKById/" + convocatoriaId;
            return $http.get(endpoint);
        };

        // Get Tematicas no relacionadas a un fondo
        service.GetTematicasNotSelect = function (fondoId) {
            var endpoint = API + "Convocatoria/GetTematicasNotSelect/" + fondoId;
            return $http.get(endpoint);
        };

        // Get ConvocatoriaById
        service.getConvocatoria = function (convocatoriaId) {
            var endpoint = API + "Convocatoria/Get/" + convocatoriaId;
            return $http.get(endpoint);
        }



        //Create Convocatoria
        service.create = function (convocatoria) {
            var endpoint = API + "Convocatoria/Create/" + convocatoria;
            return $http.post(endpoint, convocatoria);
        }

        //Create AsociacionConvocatoria
        service.createAsociacion = function (convocatoria) {
            var endpoint = API + "Convocatoria/CreateAsociacion/" + convocatoria;
            return $http.post(endpoint, convocatoria);
        }

        //Consulta parametrizada de convocatorias
        service.GetConsultaParametrizadaConvocatoria = function (param) {
            var endpoint = API + "Convocatoria/GetConsultaParametrizadaConvocatoria/" + param;
            return $http.post(endpoint, param);
        }
    
        //Lista de fondos
        service.GetListaNombreFondosPrograma = function () {
            var endpoint = API + "FondosPrograma/GetListaNombreFondosPrograma";
            return $http.get(endpoint);
        }

        //Lista de fondos
        service.GetNombresTipoConvocatoria = function () {
            var endpoint = API + "Convocatoria/GetNombresTipoConvocatoria";
            return $http.get(endpoint);
        }

        // Update Convocatoria
        service.update = function (convocatoria) {
            var endpoint = API + "Convocatoria/Update";
            return $http.put(endpoint, convocatoria);
        }

        // Update ppConvocatoria
        service.updatePPConvocatoria = function (convocatoria) {
            var endpoint = API + "Convocatoria/UpdatePPConvocatoria";
            return $http.put(endpoint, convocatoria);
        }

        // Delete Convocatoria
        service.delete = function (convocatoriaId) {
            var endpoint = API + "Convocatoria/Delete/" + convocatoriaId;
            return $http.delete(endpoint);
        }

        // Delete Convocatoria con todas sus llaves foraneas
        service.DeleteConvocatoriaWithFKS = function (convocatoriaId) {
            var endpoint = API + "Convocatoria/DeleteConvocatoriaWithFKS/" + convocatoriaId;
            return $http.delete(endpoint);
        }

        //Actualizar estado para el Eliminado Lógico
        service.UpdateEstado = function (campo) {
            var endPoint = API + "Convocatoria/UpdateEstado/" + campo;
            return $http.put(endPoint, campo);

        }

        //Obtener FondosProgramaByEstado
        service.fondosProgramaAllByEstado = function () {
            var endPoint = API + "FondosPrograma/GetAllByEstado";
            return $http.get(endPoint);
        }

        // Obtener tipos de convocatorias ... antes llamado tipos fuentes financiamiento
        service.gettiposconvocatoria  = function () {
            var endpoint = API + "TipoFuenteFinanciamiento/GetAllByEstado/";
            return $http.get(endpoint);
        }

        // Obtener tipos de convocatorias ... antes llamado tipos fuentes financiamiento
        service.getlistapaises  = function () {
            var endpoint = API + "Pais/GetAllByEstado/";
            return $http.get(endpoint);
        }

        return service;
    }
}());
