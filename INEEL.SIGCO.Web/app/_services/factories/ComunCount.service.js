(function () {
    "use strict";

    angular
        .module("ineel.services")
        .factory('comunCountService', ['$http', '$q', 'globalGet', comunService]);

    function comunService($http, $q, globalGet) {
        var API = globalGet.get("api");

        var service = {};
        //service.servicioX = {};
        //service.servicioX.MetodoX = function (id) {
        //    var endpoint = API + "ControllerX/MetodoX/" + id;
        //    return $http.get(endpoint);
        //};
        service.MT = {};
        service.CR = {};
        service.CH = {};
        service.PI = {};
        service.CP = {};
        service.GI = {};
        
        service.GI.CountFI = function () {
            var endpoint = API + "ProductoGISolicitud/CountProductoGISolicitud";
            return $http.get(endpoint);
        };
        service.GI.CountSTL = function () {
            var endpoint = API + "TecnologiaLicenciada/CountSTL";
            return $http.get(endpoint);
        };
        service.GI.CountProductosGI = function () {
            var endpoint = API + "ProductoGI/CountProductosGI";
            return $http.get(endpoint);
        };
        service.GI.CountPlanNegocioEvolutivo = function () {
            var endpoint = API + "PlanNegocioEvolutivo/CountPlanNegocioEvolutivo";
            return $http.get(endpoint);
        };
        service.GI.CountIdeaInnovadora = function () {
            var endpoint = API + "IdeaInnovadora/CountIdeaInnovadora";
            return $http.get(endpoint);
        };
        service.GI.CountPropuesta = function () {
            var endpoint = API + "Propuesta/CountPropuesta";
            return $http.get(endpoint);
        };
        service.MT.countITF = function (idestadoFlujo) {
            var endpoint = API + "InformeTecnicoFinal/CountITF/" + idestadoFlujo;
            return $http.get(endpoint);
        };
        service.MT.countInformeBec = function (idestadoFlujo) {
            var endpoint = API + "BecarioExterno/counInternoANDexternoByStatus/" + idestadoFlujo;
            return $http.get(endpoint);
        };
        service.MT.countInsumos = function (idestadoFlujo) {
            var endpoint = API + "Insumos/countByStatus/" + idestadoFlujo;
            return $http.get(endpoint);
        };
        service.MT.LAproy = function (idestadoFlujo) {
            var endpoint = API + "LAproy/countByStatus/" + idestadoFlujo;
            return $http.get(endpoint);
        };
        service.MT.countPonencia = function (idestadoFlujo) {
            var endpoint = API + "Ponencia/countByStatus/" + idestadoFlujo;
            return $http.get(endpoint);
        };
        service.MT.countCursoInterno = function (idestadoFlujo) {
            var endpoint = API + "CursoInterno/countByStatus/" + idestadoFlujo;
            return $http.get(endpoint);
        };
        service.MT.countPublicacion = function (idestadoFlujo) {
            var endpoint = API + "Publicacion/countByStatus/" + idestadoFlujo;
            return $http.get(endpoint);
        };
        service.PI.countDerechosAutor = function () {
            var endpoint = API + "DerechosAutor/GetAllInstitutoCount/";
            return $http.get(endpoint);
        };
        service.PI.countPropiedadIndustrial = function () {
            var endpoint = API + "PropiedadIndustrial/GetAllInstitutoCount/";
            return $http.get(endpoint);
        };

        service.MT.countCapitulos = function (idestadoFlujo) {
            var endpoint = API + "Capitulos/countByStatus/" + idestadoFlujo;
            return $http.get(endpoint);
        };
        service.MT.countSoftware = function (idestadoFlujo) {
            var endpoint = API + "SoftwarePersonal/countByStatus/" + idestadoFlujo;
            return $http.get(endpoint);
        };

        service.CR.countCompetidor = function (idestadoFlujo) {
            var endpoint = API + "Competidor/countByStatus/" + idestadoFlujo;
            return $http.get(endpoint);
        };

        service.CR.countAliado = function (idestadoFlujo) {
            var endpoint = API + "Aliado/countByStatus/" + idestadoFlujo;
            return $http.get(endpoint);
        };

        service.CR.countFuenteFinanciamiento = function (estado, origenes) {
            var endpoint = API + "FuenteFinanciamiento/countByStatus/" + estado + "/" + origenes;
            return $http.get(endpoint);
        };
        service.CR.countGrupoColegiadoPartInt = function (idestadoFlujo) {
            var endpoint = API + "GrupoColegiadoPartInt/countByStatus/" + idestadoFlujo;
            return $http.get(endpoint);
        };
        service.CR.countExpertos = function (idestadoFlujo) {
            var endpoint = API + "Expertos/countByStatus/" + idestadoFlujo;
            return $http.get(endpoint);
        };
        service.CR.countOportunidadNegocio = function (EstadoFlujoONId, EstadoONId) {
            var endpoint = API + "OportunidadNegocio/countByStatus/" + EstadoFlujoONId + "/" + EstadoONId;
            return $http.get(endpoint);
        };
        service.CR.EstudiosMercado = function (estado) {
            var endpoint = API + "EstudiosMercado/countByStatus/" + estado;
            return $http.get(endpoint);
        };
        service.CR.countDistinctEmpresaOfProyecto = function (estado) {
            var endpoint = API + "Proyectos/countDistinctEmpresaOfProyecto/" + estado;
            return $http.get(endpoint);
        };
        service.CR.countClientesUnidades = function () {
            var endpoint = API + "Clientes/CountProyectosClientesVigentes/";
            return $http.get(endpoint);
        };
        


        service.CH.countExpertos = function (idestadoFlujo) {
            var endpoint = API + "InventarioRH/CountCatalogoPersonasFechaActual";
            return $http.get(endpoint);
        };
        service.CH.countFamiliasPuestos = function (idestado) {
            var endpoint = API + "FamiliasPuestos/countByStatus/" + idestado;
            return $http.get(endpoint);
        };
        service.CH.countConductualAndTecnica = function (idestado) {
            var endpoint = API + "ManualCompetenciaConductual/countConductualAndTecnica/" + idestado;
            return $http.get(endpoint);
        };
        service.notification_GetAllGerenteByClaveCount = function (claveunidad) {
            var endpoint = API + "Notification/GetAllGerenteByClaveCount/" + claveunidad;
            return $http.get(endpoint);
        };
        service.notification_GetAllCount = function (clavePersona) {
            var endpoint = API + "Notification/GetAllCount/" + clavePersona;
            return $http.get(endpoint);
        };
        service.CP.countComunidadesActivas = function () {
            var endpoint = API + "Comunidades/CountComunidadesActivas";
            return $http.get(endpoint);
        };
        service.CP.CountEstadoArte = function () {
            var endpoint = API + "EstadoArte/CountEstadoArte";
            return $http.get(endpoint);
        };
        service.CP.CountTemasInnovacion = function () {
            var endpoint = API + "TemasInnovacion/CountTemasInnovacion";
            return $http.get(endpoint);
        };
        service.CP.CountInformesAnuales = function () {
            var endpoint = API + "InformeAnual/CountInformesAnuales";
            return $http.get(endpoint);
        };
        service.CP.CountMapasRuta = function () {
            var endpoint = API + "MapasRuta/CountMapasRuta";
            return $http.get(endpoint);
        };
        service.CP.CountEstudiosEspecializados = function () {
            var endpoint = API + "EstudiosEspecializados/CountEstudiosEspecializados";
            return $http.get(endpoint);
        };
        service.CP.CountPlanAnual = function () {
            var endpoint = API + "PlanAnual/CountPlanAnual";
            return $http.get(endpoint);
        };
        service.CP.CountLineamientosComunidades = function () {
            var endpoint = API + "Lineamientos/CountLineamientosComunidades";
            return $http.get(endpoint);
        };
        
        
        return service;

    }


    //foo


})();