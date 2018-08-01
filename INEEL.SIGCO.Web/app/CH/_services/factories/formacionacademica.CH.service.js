(function(){
    "use strict";
    angular
        .module("ineel.CH.services")
        .factory("FormacionAcademicaService", ["$http", "globalGet", FormacionAcademicaService]);

    function FormacionAcademicaService($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};

        //get formacion academica
        service.get = function () {
            var endPoint = API + "FormacionAcademica/GetAll";
            return $http.get(endPoint);
        }

        //getbyclaveempleado 
        service.getbyclave = function (clave) {
            var endPoint = API + "FormacionAcademica/GetByClaveEmpleado/" + clave;
            return $http.get(endPoint);
        }

        service.delete = function (Id) {
            debugger;
            var endPoint = API + "FormacionAcademica/Delete/" + Id;
            return $http.delete(endPoint);
        }

        service.getGradoAcademico = function () {
            var endPoint = API + "GradoAcademico/GetAll";
            return $http.get(endPoint);
        }
        service.getCarrera = function () {
            var endPoint = API + "carreras/GetAll";
            return $http.get(endPoint);
        }
        service.getInstituciones = function () {
            var endPoint = API + "institucion/GetAll";
            return $http.get(endPoint);
        }
        service.addFormacion = function (registrofa) {
            var endpoint = API + "FormacionAcademica/Create/" + registrofa;
            return $http.post(endpoint, registrofa);
        }

        service.updateFormacion = function (registrofa) {
            var endpoint = API + "FormacionAcademica/Update/" + registrofa;
            return $http.put(endpoint, registrofa);
        }

        //Services for edit the formacionAcademica
        //Here we will can put some services add it
        service.getFormacionAcadId = function (id) {
            var endPoint = API + "FormacionAcademica/GetById/" + id;
            return $http.get(endPoint);
        }

        service.getPaisByInstitucion = function (clave) {
            var endPoint = API + "institucion/GetById/" + clave;
            return $http.get(endPoint);
        }

        service.updateSolicitud = function (estado) {
            var endpoint = API + "Solicitud/UpdateEstado/" + estado;
            return $http.put(endpoint, estado);
        }

        service.updateValidacion = function (registrofa) {
            var endpoint = API + "FormacionAcademica/UpdateSolicitud/" + registrofa;
            return $http.put(endpoint, registrofa);
        }

        service.updateEstado = function (Registro) {
            var endPoint = API + "FormacionAcademica/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }

        service.AddSolicitud = function (Registro) {
            var endPoint = API + "Solicitud/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }

        service.mailNotificacion = function (Registro) {
            var endPoint = API + "Correo/SendNotificacion?block=no";
            return $http.post(endPoint, Registro);
        }

        service.Persona = function (clave) {
            var endPoint = API + "Personas/GetByClave/" + clave;
            return $http.get(endPoint);
        }

        service.AddBitacoraSolicitud = function (Registro) {
            var endPoint = API + "BitacoraSolicitudes/Create";
            return $http.post(endPoint, Registro);
        }

        service.ValidaRegistroDuplicado = function (obj) {  
            var endPoint = API + "FormacionAcademica/ValidarDuplicados";
            return $http.post(endPoint,obj);
        }

        return service;

    }

})();