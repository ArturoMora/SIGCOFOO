(function () {
    "use strict";

    angular
        .module("ineel.services")
        .factory('comunDetailsService', ['$http', 'globalGet', comunDetailsService]);

    function comunDetailsService($http, globalGet) {
        var API = globalGet.get("api");
        
        var service = {};
        //service.Ponencia_getbyclave = function (clave) {
        //    var endPoint = API + "Ponencia/GetByClave/" + clave;
        //    return $http.get(endPoint);
        //}
        service.Capacitacion_GetByClavePersonaANDestadoFlujo = function (clave, estadoFlujo) {
            var endPoint = API + "CapacitacionYcertificacion/GetByClavePersonaANDestadoFlujo/" + clave + "/" + estadoFlujo;
            return $http.get(endPoint);
        }
        service.CertificacionesObtenidas_GetByClavePersonaANDestadoFlujo = function (clave, estadoFlujo) {
            var endPoint = API + "CertificacionesObtenidas/GetByClavePersonaANDestadoFlujo/" + clave + "/" + estadoFlujo;
            return $http.get(endPoint);
        }
        
        service.SNI_GetByClaveEstadoFlujo = function (clave, aniosAtras, estados) {
            var endPoint = API + "SNI/GetByClaveEmpEstadoFlujo/" + clave+"/" +aniosAtras+"/"+estados;
            return $http.get(endPoint);
        }
        service.FA_GetByClaveEstadoFlujo = function (clave, estados) {
            var endPoint = API + "FormacionAcademica/GetByClaveEmpEstadoFlujo/" + clave +  "/" + estados;
            return $http.get(endPoint);
        }
        service.ParticipacionP_GetByClaveEstadoFlujo = function (clave, aniosAtras, estados) {
            var endPoint = API + "PersonalProyecto/GetByClaveEmpEstadoFlujo/" + clave + "/" + aniosAtras + "/" + estados;
            return $http.get(endPoint);
        }
        service.BecarioDir_GetByClaveEstadoFlujo = function (clave, aniosAtras, estados) {
            var endPoint = API + "BecarioDirigido/GetByClaveEmpEstadoFlujo/" + clave + "/" + aniosAtras + "/" + estados;
            return $http.get(endPoint);
        }
        service.ExpDocente_GetByClaveEstadoFlujo = function (clave, estados) {
            var endPoint = API + "ExperienciaDocente/GetByClaveEmpEstadoFlujo/" + clave + "/"  + estados;
            //var endPoint = API + "ExperienciaDocente/GetByClaveEmpEstadoFlujo/" + clave + "/" + aniosAtras + "/" + estados;
            return $http.get(endPoint);
        }
        ////////////< ok

        service.getExtractoById = function (id) {
            var endpoint = API + "ExtractoProfesional/GetByClave/" + id;
            return $http.get(endpoint);
        }
        service.getByEmpleadoTecnica = function (obj) {
            var endpoint = API + "DetalleEvaluacionTecnicas/GetTopByPersona/" + obj;
            return $http.post(endpoint, obj);
        }

        service.getByClaveEvaluacion = function (id) {
            var endpoint = API + "DetalleEvaluacionConductual/GetByClaveEvaluacion/" + id;
            return $http.get(endpoint);
        }
        service.EvaluacionConductual_GetTopByPersona = function (clave) {
            var endPoint = API + "EvaluacionConductual/GetTopByPersona/" + clave;
            return $http.get(endPoint);
        }
        service.EvaluacionTecnica_GetTopByPersona = function (obj) {
            var endpoint = API + "EvaluacionTecnicas/GetTopByPersona/" + obj;
            return $http.post(endpoint, obj);
        }
        service.getByEmpleadoListTecnica = function (id) {
            var endpoint = API + "DetalleEvaluacionTecnicas/GetTopByPersona/"+id;
            return $http.get(endpoint);
        }

        //service.getByPersonaPeriodo = function (obj) {
        //    var endpoint = API + "EvaluacionTecnicas/GetByPersonaPeriodo/" + obj;
        //    return $http.post(endpoint, obj);
        //}

        //service.getPersonaById = function (clave) {
        //    var endPoint = API + "Personas/GetById/" + clave;
        //    return $http.get(endPoint);
        //}
        service.getPersonaById = function (clave) {
            var endPoint = API + "Personas/GetByIdFichaPersonal/" + clave;
            return $http.get(endPoint);
        }
        service.AutorInternoCapitulo_GetAllByAutor = function (clave, estados) {
            var endPoint = API + "AutorInternoCapitulo/GetAllByAutorAndStatus/" + clave +"/"+ estados;
            return $http.get(endPoint);
        }
        service.AutorSoftware_GetByClaveEmpleado = function (clave) {
            var endPoint = API + "AutorSoftware/GetByClaveEmpleado/" + clave;
            return $http.get(endPoint);
        }
        service.getadjunto64 = function (id) {
            var endPoint = API + "Personas/ObtenerFotobyIdAdjunto/" + id;
            //console.log(endPoint);
            return $http.get(endPoint);
        }
        //service.logrosDestacadosByClaveEmpleado = function (id) {
        //    var endPoint = API + "LogrosReconocimientos/GetAllByClaveEmpleado/" + id;
        //    return $http.get(endPoint);
        //}
        service.SolicitudesDA_GetByClaveEmpleado = function (id) {
            var endPoint = API + "DerechosAutor/GetPorClavePersona/" + id;
            return $http.get(endPoint);
        }

        service.getalmamater = function (clave) {
            var endPoint = API + "FormacionAcademica/GetAlmaMater/" + clave;
            return $http.get(endPoint);
        }

         service.getPersonaById = function (clave) {
            var endPoint = API + "Personas/GetByIdFichaPersonal/" + clave;
            return $http.get(endPoint);
        }

        service.getalmamater = function (clave) {
            var endPoint = API + "FormacionAcademica/GetAlmaMater/" + clave;
            return $http.get(endPoint);
        }
        service.getMovimientoPuesto = function (claveEmpleado) {
            var endPoint = API + "MovimientoPuesto/GetAllByClaveEmpleado/" + claveEmpleado;
            return $http.get(endPoint);
        }

        service.getMovimientoUnidadOrg = function (claveEmpleado) {
            var endPoint = API + "MovimientoUnidadOrg/GetAllByClaveEmpleadoUO/" + claveEmpleado;
            return $http.get(endPoint);
        }
        service.getMovimientoUnidadOrgNew = function (claveEmpleado) {
            var endPoint = API + "MovimientoUnidadOrg/GetAllByClaveEmpleadoUONew/" + claveEmpleado;
            return $http.get(endPoint);
        }
        service.getMovimientoCategoria = function (claveEmpleado) {
            var endPoint = API + "MovimientoCategoria/GetAllByClaveEmpleado/" + claveEmpleado;
            return $http.get(endPoint);
        }
        service.getCompetencias = function (id) {
            var endpoint = API + "ListaEmpleadosSind/GetCompetencias/" + id;
            return $http.get(endpoint);
        }
        service.BecarioInterno_getbyclave = function (clave) {
            var endPoint = API + "BecarioInterno/GetByClave/" + clave;
            return $http.get(endPoint);
        }
        service.AptitudesEmpleado_GetAllByEmpleado = function (clave, votante) {
            var endPoint = API + "AptitudesEmpleado/GetAllByEmpleado/" + clave + "/" + votante;
            return $http.get(endPoint);
        }
        service.LikesLinked_GetAllById_Empleado = function (idAptitud, clavePersona) {
            var endPoint = API + "LikesLinked/GetAllById_Empleado/" + idAptitud + "/" + clavePersona;
            return $http.get(endPoint);
        }
        service.LikesLinked_UpdateStadoOrCreate = function (model) {
            var endPoint = API + "LikesLinked/UpdateStadoOrCreate";
            return $http.post(endPoint, model);
        }
        
        service.PIExterno_GetByPersona = function (clave) {
            var endPoint = API + "PropiedadIndustrial/GetPropiedadIndustrialPorPersona/" + clave;
            return $http.get(endPoint);
        }
        service.BecarioExternogetByClave = function (clave) {
            var endPoint = API + "BecarioExterno/GetByClaveBecario/" + clave;
            return $http.get(endPoint);
        }

        service.GetBecariosDirigidosByPersona = function (clave) {
            var endPoint = API + "BecarioExternoINEEL/GetBecariosDeInvestigadores/" + clave;
            return $http.get(endPoint);
        }

        service.GetEstanciasDeInvestigadoresEnInstituto = function (clave) {
            var endPoint = API + "BecarioExternoINEEL/GetEstanciasDeInvestigadoresEnInstituto/" + clave;
            return $http.get(endPoint);
        }
        

        return service;
    }

//foo


})();