(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("OportunidadNegocioCRService", [
            "$http",
            "globalGet",
            OportunidadNegocioCRService
        ]);

    function OportunidadNegocioCRService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};
        //Oportunidad de negocios//////////////////
        service.getTiposEventos = function () {
            var endpoint = API + "OportunidadNegocio/GetTiposEventos";
            return $http.get(endpoint);
        };
        service.getEventosByTipoEvento = function (Id) {
            var endpoint = API + "OportunidadNegocio/GetEventosByTipo/" + Id;
            return $http.get(endpoint);
        };
        service.getOportunidadesDonnut = function () {
            var endpoint = API + "OportunidadNegocio/GetDonnut";
            return $http.get(endpoint);
        };
        service.getOportunidadesPorAsignadar = function (Id) {
            var endpoint = API + "OportunidadNegocio/GetOportunidadesPorAsignar/" + Id;
            return $http.get(endpoint);
        };
        service.getMisOportunidadesRegistradas = function (Id) {
            var endpoint = API + "OportunidadNegocio/GetMisOportunidadesRegistradas/" + Id;
            return $http.get(endpoint);
        };
        service.getMisOportunidadesAsignadasEspecialista = function (Id) {
            var endpoint = API + "OportunidadNegocio/getMisOportunidadesAsignadasEspecialista/" + Id;
            return $http.get(endpoint);
        };
        service.getMisOportunidadesAsignadas = function (Id) {
            var endpoint = API + "OportunidadNegocio/getMisOportunidadesAsignadas/" + Id;
            return $http.get(endpoint);
        };
        service.getMisOportunidadesAsignadasGerente = function (Id) {
            var endpoint = API + "OportunidadNegocio/getMisOportunidadesAsignadasGerente/" + Id;
            return $http.get(endpoint);
        };
        service.getOportunidad = function (oportunidadNegocioId) {
            var endpoint = API + "OportunidadNegocio/GetById/" + oportunidadNegocioId;
            return $http.get(endpoint);
        };
        service.getBySeguimiento = function (Id) {
            var endpoint = API + "OportunidadNegocio/GetBySeguimiento/" + Id;
            return $http.get(endpoint);
        };
        service.createOportunidad = function (oportunidad) {
            var endpoint = API + "OportunidadNegocio/Create";
            return $http.post(endpoint, oportunidad);
        };
        service.updateOportunidad = function (oportunidad) {
            var endpoint = API + "OportunidadNegocio/Update";
            return $http.put(endpoint, oportunidad);
        };
        service.updateOportunidadON = function (oportunidad) {
            var endpoint = API + "OportunidadNegocio/updateONEstado";
            return $http.put(endpoint, oportunidad);
        };
        service.rechazarOportunidad = function (oportunidad) {
            var endpoint = API + "OportunidadNegocio/Rechazar";
            return $http.put(endpoint, oportunidad);
        };
        service.rechazarOportunidadInvestigador = function (oportunidad) {
            var endpoint = API + "OportunidadNegocio/RechazarInvestigador";
            return $http.put(endpoint, oportunidad);
        };
        service.aceptarOportunidad = function (oportunidad) {
            var endpoint = API + "OportunidadNegocio/AceptarOportunidad";
            return $http.put(endpoint, oportunidad);
        };
        service.asignarOportunidadInvestigador = function (oportunidad) {
            var endpoint = API + "OportunidadNegocio/AsignarInvestigador";
            return $http.put(endpoint, oportunidad);
        }
        service.updateOportunidadEspecialista = function (oportunidad) {
            var endpoint = API + "OportunidadNegocio/UpdateOportunidadEspecialista";
            return $http.put(endpoint, oportunidad);
        };
        service.deleteOportunidad = function (oportunidad) {
            var endpoint = API + "OportunidadNegocio/Delete";
            return $http.put(endpoint, oportunidad);
        };
        service.GetPersonas = function () {
            var endPoint = API + "Personas/GetPersonasByComercializacion/";
            return $http.get(endPoint);
        }
        service.getInvestigadoresByUnidad = function (Id) {
            var endPoint = API + "Personas/GetUsersByClaveUnidad/" + Id;
            return $http.get(endPoint);
        }
        service.getInvestigadoresByUnidadPadre = function (Id) {
            var endPoint = API + "Personas/GetUsersByClaveUnidadPadre/" + Id;
            return $http.get(endPoint);
        }
        service.getOportunidadHistorico = function (Id) {
            var endPoint = API + "OportunidadNegocio/GetOportunidadesHistorico/" + Id;
            return $http.get(endPoint);
        }
        service.getOportunidadHistorico2 = function (Id) {
            var endPoint = API + "OportunidadNegocio/GetOportunidadesHistorico2/" + Id;
            return $http.get(endPoint);
        }
        service.getPersonaByResponsable = function (Id) {
            var endPoint = API + "OportunidadNegocio/GetPersonaByResponsable/" + Id;
            return $http.get(endPoint);
        }
        service.getEstadosON = function () {
            var endpoint = API + "OportunidadNegocio/GetAllEstadosON";
            return $http.get(endpoint);
        };
        service.getEstadosONById = function (Id) {
            var endpoint = API + "OportunidadNegocio/getEstadosONById/" + Id;
            return $http.get(endpoint);
        };
        ///Correos
        service.mailNotificacion = function (Registro) {
            var endPoint = API + "Correo/SendNotificacion?block=no";
            return $http.post(endPoint, Registro);
        }
        // Get Propuestas Asignados
        service.getOportunidadesAsignadasEmpresa = function (Id) {
            var endpoint = API + "OportunidadNegocio/GetAllOportunidadesAsociadas/" + Id;
            return $http.get(endpoint);
        };
        //Especialistas///////////////////////////////
        service.getPersonasByIdRolTrue = function () {
            var endPoint = API + "RolPersona/GetPersonasByIdRolByTrue";
            return $http.get(endPoint);
        }
        service.getPersonasByIdRol = function () {
            var endPoint = API + "RolPersona/GetPersonasByIdRol";
            return $http.get(endPoint);
        }
        service.AddEspecialista = function (especialista) {
            var endPoint = API + "RolPersona/CreateEspecialista/" + especialista;
            return $http.post(endPoint, especialista);
        }
        service.eliminarEspecialista = function (id) {
            var endPoint = API + "RolPersona/Delete/" + id;
            return $http.delete(endPoint, id);
        }

        service.editarEspecialista = function (especialista) {
            var endPoint = API + "RolPersona/Update";
            return $http.put(endPoint, especialista);
        }
        ///Responable Unidades
        service.getOportunidadesPorAsignarAInvestigador = function (id) {
            var endpoint = API + "OportunidadNegocio/GetOportunidadesPorAsignarAInvestigador/" + id;
            return $http.get(endpoint);
        };


        //Catalogos/////////eventos////////////////
        service.getTiposEventosDisponibles = function () {
            var endpoint = API + "Eventos/GetTiposEventos";
            return $http.get(endpoint);
        };
        service.getEventos = function () {
            var endpoint = API + "Eventos/Get";
            return $http.get(endpoint);
        };
        service.getEvento = function (eventoId) {
            var endpoint = API + "Eventos/GetById/" + eventoId;
            return $http.get(endpoint);
        };
        service.createEvento = function (evento) {
            var endpoint = API + "Eventos/Create";
            return $http.post(endpoint, evento);
        };
        service.updateEvento = function (evento) {
            var endpoint = API + "Eventos/Update";
            return $http.put(endpoint, evento);
        };
        service.deleteEvento = function (evento) {
            var endpoint = API + "Eventos/Delete";
            return $http.put(endpoint, evento);
        };
        //Actualizar estado para el Eliminado Lógico
        service.UpdateEstado = function (campo) {
            var endPoint = API + "Eventos/UpdateEstado/" + campo;
            return $http.put(endPoint, campo);
        }

        ////////TipoEventos///////////////////////////
        service.getTiposEventos = function () {
            var endpoint = API + "TiposEventos/Get";
            return $http.get(endpoint);
        };
        service.getTipoEvento = function (tipoEventoId) {
            var endpoint = API + "TiposEventos/GetById/" + tipoEventoId;
            return $http.get(endpoint);
        };
        service.createTipoEvento = function (tipoEvento) {
            var endpoint = API + "TiposEventos/Create";
            return $http.post(endpoint, tipoEvento);
        };
        service.updateTipoEvento = function (tipoEvento) {
            var endpoint = API + "TiposEventos/Update";
            return $http.put(endpoint, tipoEvento);
        };
        service.deleteTipoEvento = function (tipoEvento) {
            var endpoint = API + "TiposEventos/Delete";
            return $http.put(endpoint, tipoEvento);
        };

        ////////Seguimiento///////////////////////////
        service.getSeguimientosByON = function (oportunidadId) {
            var endpoint = API + "SeguimientoOportunidad/Get/" + oportunidadId;
            return $http.get(endpoint);
        };
        service.getSeguimiento = function (seguimientoId) {
            var endpoint = API + "SeguimientoOportunidad/GetById/" + seguimientoId;
            return $http.get(endpoint);
        };
        service.createSeguimiento = function (seguimiento) {
            var endpoint = API + "SeguimientoOportunidad/Create";
            return $http.post(endpoint, seguimiento);
        };
        service.updateSeguimiento = function (seguimiento) {
            var endpoint = API + "SeguimientoOportunidad/Update";
            return $http.put(endpoint, seguimiento);
        };
        service.deleteSeguimiento = function (seguimientoId) {
            var endpoint = API + "SeguimientoOportunidad/Delete/" + seguimientoId;
            return $http.delete(endpoint, seguimientoId);
        };
        return service;
    }
}());