(function () {
    "use strict";

    angular
        .module("ineel.CR.services")
        .factory("ContactosCRService", [
            "$http",
            "globalGet",
            ContactosCRService
        ]);

    function ContactosCRService($http, globalGet) { //servicios personales llamas a los metodos del WEBApi
        var API = globalGet.get("api");
        var service = {};

        // Get Empresas activas
        service.getEmpresasByTrue = function () {
            var endpoint = API + "Empresas/GetByTrue";
            return $http.get(endpoint);
        };
        // Get Contactos
        service.getContactos = function () {
            var endpoint = API + "Contactos/Get";
            return $http.get(endpoint);
        };
        // Get Contactos Para Modal
        service.getContactosModal = function (contactos) {
            var endPoint = API + "Contactos/GetContactosModal/";
            return $http.post(endPoint, contactos);
        }
        // Get Contacto
        service.getContacto = function (contactoId) {
            var endpoint = API + "Contactos/GetContacto/" + contactoId;
            return $http.get(endpoint);
        }
        // Create Contacto
        service.create = function (contacto) {
            var endpoint = API + "Contactos/Create/" + contacto;
            return $http.post(endpoint, contacto);
        }
        // Create ContactoCreateContact
        service.createContact = function (contacto) {
            var endpoint = API + "Contactos/CreateContact/" + contacto;
            return $http.post(endpoint, contacto);
        }
        service.update = function (contacto) {
            var endpoint = API + "Contactos/Update";
            return $http.put(endpoint, contacto);
        }
        // Delete Contacto ////Se duda de la funcionalidad del servicio, por ende se deja, sin embargo el que funciona es el servicio de abajo
        service.delete = function (contactoId) {
            var endpoint = API + "Contactos/Delete/" + contactoId;
            return $http.delete(endpoint);
        }
        //Borrar contacto
        service.BorrarContacto = function (contactoId) {
            var endpoint = API + "Contactos/BorrarContacto/" + contactoId;
            return $http.delete(endpoint);
        }
        // Create Perfil al Contacto
        service.createPerfil = function (contactoPerfil) {
            var endpoint = API + "ContactosPerfiles/Create/" + contactoPerfil;
            return $http.post(endpoint, contactoPerfil);
        }
        // Get Perfil Editar
        service.getContactoPerfilEdit = function (contactoPerfilId) {
            var endpoint = API + "ContactosPerfiles/GetPerfil/" + contactoPerfilId;
            return $http.get(endpoint);
        }
        // Get ContactoPerfil
        service.getContactoPerfil = function (contactoId) {
            var endpoint = API + "ContactosPerfiles/Get/" + contactoId;
            return $http.get(endpoint);
        }
        // Update ContactoPerfil
        service.updateContactoPeril = function (contactoPerfil) {
            var endpoint = API + "ContactosPerfiles/Update/" + contactoPerfil;
            return $http.put(endpoint, contactoPerfil);
        }
        // Delete ContactoPerfil
        service.deleteContactoPerfil = function (contactoId) {
            var endpoint = API + "ContactosPerfiles/Delete/" + contactoId;
            return $http.delete(endpoint);
        }
        // Create PuestoHistorico al Contacto
        service.createPuestoHistorico = function (contactoPuesto) {
            var endpoint = API + "ContactosPuestosHistoricos/Create/" + contactoPuesto;
            return $http.post(endpoint, contactoPuesto);
        }
        // Update PuestoHistorico
        service.updatePuestoHistorico = function (contactoPuesto) {
            var endpoint = API + "ContactosPuestosHistoricos/Update/" + contactoPuesto;
            return $http.put(endpoint, contactoPuesto);
        }
        // Get Puesto Editar
        service.getPuestoHistoricoEdit = function (contactoPuestoHistoricoId) {
            var endpoint = API + "ContactosPuestosHistoricos/GetPuesto/" + contactoPuestoHistoricoId;
            return $http.get(endpoint);
        }
        // Get ContactoPuesto
        service.getPuestoHistorico = function (contactoId) {
            var endpoint = API + "ContactosPuestosHistoricos/Get/" + contactoId;
            return $http.get(endpoint);
        }
        // Delete ContactoPuesto
        service.deleteContactoPuesto = function (contactoId) {
            var endpoint = API + "ContactosPuestosHistoricos/Delete/" + contactoId;
            return $http.delete(endpoint);
        }
        //Actualizar estado para el Eliminado L�gico
        service.updateEstado = function (campo) {
            var endPoint = API + "Contactos/UpdateEstado/" + campo;
            return $http.put(endPoint, campo);
        }
        //Invoco los grados academicos
        service.getGradoAcademico = function () {
            var endPoint = API + "GradoAcademico/GetAll";
            return $http.get(endPoint);
        }
        //Invoco las carreras
        service.getCarreras = function () {
            var endPoint = API + "Carreras/GetAll";
            return $http.get(endPoint);
        }
        //Invoco las instituciones
        service.getIntituciones = function () {
            var endPoint = API + "Institucion/GetAll";
            return $http.get(endPoint);
        }
        //Invoco los paises
        service.getPaises = function () {
            var endPoint = API + "Pais/GetAll";
            return $http.get(endPoint);
        }
        service.GetAllnodes = function (Unidad) {
            var endPoint = API + "UnidadOrganizacionalEmpresas/GetAllnodes";
            return $http.post(endPoint, Unidad);
        }

        service.GetAllByEmpresa = function (id) {
            var endPoint = API + "Contactos/GetAllByEmpresa/"+id;
            return $http.get(endPoint);
        }

        return service;
    }
}());