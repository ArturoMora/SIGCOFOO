(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("AliadosCRService", [
        "$http",
        "globalGet",
        AliadosCRService
        ]);

    function AliadosCRService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        // Get Aliados
        service.getAliados = function () {
            var endpoint = API + "Aliado/GetAll";
            return $http.get(endpoint);
        };

        // Get Aliados con convenios historicos
        service.GetAllConveniosHistoricos = function () {
            var endpoint = API + "Aliado/GetAllConveniosHistoricos";
            return $http.get(endpoint);
        };

        // Get Aliados con convenios vigentes
        service.GetAllConveniosVigentes = function () {
            var endpoint = API + "Aliado/GetAllConveniosVigentes";
            return $http.get(endpoint);
        };

        // Get Aliados
        service.getAliados = function () {
            var endpoint = API + "Aliado/GetAll";
            return $http.get(endpoint);
        };

        // Get aliadoById
        service.getAliado = function (aliadoId) {
            var endpoint = API + "Aliado/GetByIdFK/" + aliadoId;
            return $http.get(endpoint);
        }

        // Get aliadoById
        service.getAliadoSimple = function (aliadoId) {
            var endpoint = API + "Aliado/Get/" + aliadoId;
            return $http.get(endpoint);
        }

        //Create aliado
        service.create = function (aliado) {
            var endpoint = API + "Aliado/Create/" + aliado;
            return $http.post(endpoint, aliado);
        }

        // obtiene los cnvenios vigentes
        service.getconveniosvigentes = function () {
            var endpoint = API + "Convenio/GetConveniosVigentes/";
            return $http.get(endpoint);
        }

        // Consulta parametrizada de convocatorias
        service.GetConsultaParametrizadaExpertos = function (obj) {
            var endpoint = API + "Aliado/GetConsultaParametrizadaAliados/" + obj;
            return $http.post(endpoint, obj);
        }

        // Get empresas
        service.getEmpresas = function () {
            var endpoint = API + "Aliado/GetEmpresas";
            return $http.get(endpoint);
        }

        // Get tipos de convenio
        service.getTiposConvenio = function () {
            var endpoint = API + "Aliado/GetTipoConvenios";
            return $http.get(endpoint);
        }

        //Create aliado
        service.createConvenio = function (aliado) {
            var endpoint = API + "Aliado/CreateConvenio/" + aliado;
            return $http.post(endpoint, aliado);
        }

        //Create aliado Actividad
        service.createActividad = function (aliado) {
            var endpoint = API + "Aliado/CreateActividad/" + aliado;
            return $http.post(endpoint, aliado);
        }

        // Update aliado
        service.update = function (aliado) {
            var endpoint = API + "Aliado/Update";
            return $http.put(endpoint, aliado);
        }

        // Update aliado
        service.updateConvenio = function (convenio) {
            var endpoint = API + "Aliado/UpdateConvenio";
            return $http.put(endpoint, convenio);
        }

        // Update actividad
        service.updateActividad = function (actividad) {
            var endpoint = API + "Aliado/UpdateActividad";
            return $http.put(endpoint, actividad);
        }

        // Delete aliado
        service.delete = function (aliadoId) {
            var endpoint = API + "Aliado/Delete/" + aliadoId;
            return $http.delete(endpoint);
        }

        // Delete aliado
        service.deleteConvenio = function (convenioId) {
            var endpoint = API + "Aliado/DeleteConvenioFromAliados/" + convenioId;
            return $http.delete(endpoint);
        }

        service.deleteActividad = function (actividadId) {
            var endpoint = API + "Aliado/DeleteActividadFromAliados/" + actividadId;
            return $http.delete(endpoint);
        }


        //Actualizar estado para el Eliminado Lógico
        service.UpdateEstado = function (campo) {
            var endPoint = API + "Aliado/UpdateEstado/" + campo;
            return $http.put(endPoint, campo);
        }

        // Get tipos de convenio
        service.tipoConvenioAllByEstado = function () {
            var endPoint = API + "TipoConvenio/GetAllByEstado";
            return $http.get(endPoint);
        }
        // Get los ambitos Convenio
        service.ambitoAllByEstado = function () {
            var endPoint = API + "AmbitoConv/GetAllByEstado";
            return $http.get(endPoint);
        }
        service.validaAliado = function (empresaId) {
            //debugger;
            var endpoint = API + "Aliado/validaAliado/" + empresaId;
            return $http.get(endpoint);
        };
        service.getConvenio = function (convenioId) {
            //debugger;
            var endpoint = API + "Aliado/GetConvByIdFK/" + convenioId;
            return $http.get(endpoint);
        };
        service.getActividad = function (ActividadId) {
            //debugger;
            var endpoint = API + "Aliado/GetActByIdFK/" + ActividadId;
            return $http.get(endpoint);
        };
        service.getConvenioSimple = function (convenioId) {
            //debugger;
            var endpoint = API + "Aliado/GetConvById/" + convenioId;
            return $http.get(endpoint);
        };


        //Create adjunto convenio
        service.registraAdjuntoConvenio = function (obj) {
            var endpoint = API + "AdjuntoPorConvenio/Create/" + obj;
            return $http.post(endpoint, obj);
        }

        //elimina adjunto convenio
        service.eliminaAdjuntoConvenio = function (id) {
            var endpoint = API + "AdjuntoPorConvenio/Delete/" + id;
            return $http.delete(endpoint, id);
        }

        //Create area convenio
        service.registraAreaConvenio = function (obj) {
            var endpoint = API + "AreaConvenio/Create/" + obj;
            return $http.post(endpoint, obj);
        }
        
        //elimina area convenio
        service.eliminaAreaConvenio = function (id) {
            var endpoint = API + "AreaConvenio/Delete/" + id;
            return $http.delete(endpoint, id);
        }
        
        //Create area actividad
        service.registraArea = function (obj) {
            var endpoint = API + "AreaActividadAdicional/Create/" + obj;
            return $http.post(endpoint, obj);
        }

        //Create persona actividad
        service.registraPersona = function (obj) {
            var endpoint = API + "PersonalActividadAdicional/Create/" + obj;
            return $http.post(endpoint, obj);
        }

        //elimina area actividad
        service.eliminaArea = function (id) {
            var endpoint = API + "AreaActividadAdicional/Delete/" + id;
            return $http.delete(endpoint, id);
        }

        //Create persona actividad
        service.eliminaPersona = function (id) {
            var endpoint = API + "PersonalActividadAdicional/Delete/" + id;
            return $http.delete(endpoint, id);
        }


        // Update actividad
        service.updateActividadActualizado = function (obj) {
            var endpoint = API + "Aliado/UpdateActividadActualizado/"+obj ;
            return $http.put(endpoint, obj);
        }

        //AÑADE ARCHIVO
        service.AddFile = function (Registro) {
            var request = $http({
                method: "post",
                url: API + "AdjuntoGenerales/Create/",
                headers: { 'Content-Type': 'application/json' },
                data: Registro
            });
            return request;
        }
       

        //elimina adjunto 
        service.eliminaArchivoAdjunto = function (id) {
            var endpoint = API + "AdjuntoGenerales/Delete/" + id;
            return $http.delete(endpoint, id);
        }

        return service;
    }

}());