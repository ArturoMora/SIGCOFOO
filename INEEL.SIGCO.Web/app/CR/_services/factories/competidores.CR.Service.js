(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("CompetidoresCRService", [
        "$http",
        "globalGet",
        CompetidoresCRService
        ]);

    function CompetidoresCRService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        // Get Competidores
        service.getCompetidores = function () {
            var endpoint = API + "Competidor/GetAll";
            return $http.get(endpoint);
        };

        service.getCompetidoresActivos = function () {
            var endpoint = API + "Competidor/GetCompetidoresActivos";
            return $http.get(endpoint);
        };

        // Get consulta parametrizada
        service.GetConsultaParametrizadaCompetidores = function (obj) {
            var endpoint = API + "Competidor/GetConsultaParametrizadaCompetidores";
            return $http.post(endpoint,obj);
        };

        //Get servicios de competidores
        service.GetServiciosCompetidores = function () {
            var endpoint = API + "Competidor/GetServiciosCompetidores";
            return $http.get(endpoint);
        }

        //Get productos de competidores
        service.GetProductosCompetidores = function () {
            var endpoint = API + "Competidor/GetProductosCompetidores";
            return $http.get(endpoint);
        }

        //Get empresas registradas como competidores
        service.GetEmpresasCompetidoras = function () {
            var endpoint = API + "Competidor/GetEmpresasCompetidoras";
            return $http.get(endpoint);
        }

        //Get segmentos registrados como competidores
        service.GetSegmentosCompetidores = function () {
            var endpoint = API + "Competidor/GetSegmentosCompetidores";
            return $http.get(endpoint);
        }

        // Get CompetidorById
        service.getCompetidor = function (competidorId) {
            var endpoint = API + "Competidor/Get/" + competidorId;
            return $http.get(endpoint);
        }
        //Get competidores para gráfico
        service.getCompetidoresPorLinea = function () {
            var endpoint = API + "Competidor/GetCompetidoresGraph";
            return $http.get(endpoint);
        }


        // Delete aliado
        service.deleteCompetidor = function (competidorId) {
            var endpoint = API + "Competidor/DeleteCompetidor/" + competidorId;
            return $http.delete(endpoint);
        }

        //Create Competidor
        service.create = function (competidor) {
            
            var endpoint = API + "Competidor/Create";
            return $http.post(endpoint, competidor);
        }

        // Update Competidores
        service.update = function (competidor) {
            var endpoint = API + "Competidor/Update";
            return $http.put(endpoint, competidor);
        }

        // Delete AreaInvestigacion
        service.delete = function (competidorId) {
            var endpoint = API + "Competidor/Delete/" + competidorId;
            return $http.delete(endpoint);
        }

        //Actualizar estado para el Eliminado Lógico
        service.UpdateEstado = function (campo) {
            var endPoint = API + "Competidor/UpdateEstado/" + campo;
            return $http.put(endPoint, campo);
        }

        //Obtener Linea desarrollo
        service.lineaDesarrolloTecnologico = function () {
            var endPoint = API + "LineaDesarrolloTecnologico/GetAllByEstado";
            return $http.get(endPoint);
        }

        //Obtener Tamano empresa
        service.tamanoEmpresa = function () {
            var endPoint = API + "TamanoEmpresa/GetAllByEstado";
            return $http.get(endPoint);
        }

        //Obtener SegmentoMercado
        service.segmentoMercado = function () {
            var endPoint = API + "SegmentoMercado/GetAllByEstado";
            return $http.get(endPoint);
        }

        service.validaCompetidor = function (empresaId) {
            //
            var endpoint = API + "Competidor/validaCompetidor/" + empresaId;
            return $http.get(endpoint);
        };

        service.validaServicioCompetidor = function (parametros) {
            
            var endpoint = API + "Competidor/validaServicioCompetidor" ;
            return $http.post(endpoint, parametros);
        };

        service.validaProductoCompetidor = function (parametros) {
            
            var endpoint = API + "Competidor/validaProductoCompetidor";
            return $http.post(endpoint, parametros);
        };

        service.accesoArchivo = function (registro) {
            var endpoint = API + "EstudiosMercado/AccesoArchivo/" + registro;
            return $http.post(endpoint, registro);
        }


        //Create producto
        service.registraProducto = function (obj) {
            var endpoint = API + "Competidor/CreateInsertaProducto/" + obj;
            return $http.post(endpoint, obj);
        }

        //Create producto
        service.registraServicio = function (obj) {
            var endpoint = API + "Competidor/CreateInsertaServicio/" + obj;
            return $http.post(endpoint, obj);
        }


        // Delete PRODUCTO POR COMPETIDOR
        service.eliminaProducto = function (id) {
            var endpoint = API + "ProductoPorCompetidor/Delete/" + id;
            return $http.delete(endpoint);
        }

        // Delete PRODUCTO POR COMPETIDOR
        service.eliminaServicio = function (id) {
            var endpoint = API + "ServicioPorCompetidor/Delete/" + id;
            return $http.delete(endpoint);
        }

        service.GetGerenteByClaveUnidad=function(id){
            var endpoint = API + "Personas/GetGerenteByClaveUnidad/" + id;
            return $http.get(endpoint);
        }

        service.verificaGerenteComercializacion=function(id){
            var endpoint = API + "competidor/verificaGerenteComercializacion/" + id;
            return $http.get(endpoint);
        }

        return service;
    }

}());