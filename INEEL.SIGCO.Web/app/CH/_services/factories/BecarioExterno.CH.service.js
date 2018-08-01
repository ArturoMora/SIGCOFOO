(function () {
    "use strict";
    angular
        .module("ineel.CH.services")
        .factory("BecarioExternoServiceCH", ["$http", "globalGet", BecarioExternoServiceCH]);

    function BecarioExternoServiceCH($http, globalGet) {
        var API = globalGet.get("api");
        var service = {};
        service.Persona = function (clave) {
            var endPoint = API + "Personas/GetByClave/" + clave;
            return $http.get(endPoint);
        }
        //get formacion academica
        service.getAll = function () {
            var endPoint = API + "BecarioExterno/GetAll";
            return $http.get(endPoint);
        }
        // Get 
        service.getUO = function (FooID) {
            var endpoint = API + "UnidadOrganizacional/GetById/" + FooID;
            return $http.get(endpoint);
        }
        // Get 
        service.getById = function (FooID) {
            var endpoint = API + "BecarioExterno/GetById/" + FooID;
            return $http.get(endpoint);
        }

        service.getInstituciones = function () {
            var endPoint = API + "institucion/GetAll";
            return $http.get(endPoint);
        }
        service.getTipoBeca = function () {
            var endPoint = API + "tipobeca/GetAll";
            return $http.get(endPoint);
        }


        service.addBecario = function (registroBecario) {
            var endpoint = API + "BecarioExterno/Create/" + registroBecario;
            return $http.post(endpoint, registroBecario);
        }
        service.Update = function (registroBecario) {
            var endpoint = API + "BecarioExterno/Update/" + registroBecario;
            return $http.put(endpoint, registroBecario);
        }
        //Actualizar estado
        service.updateEstado = function (Registro) {
            var endPoint = API + "BecarioExterno/UpdateEstado/" + Registro;
            return $http.put(endPoint, Registro);
        }
        //getbyclaveempleado 
        service.getByClave = function (clave) {
            var endPoint = API + "BecarioExterno/GetByClaveBecario/" + clave;
            return $http.get(endPoint);
        }

        service.delete = function (Id) {
            debugger;
            var endPoint = API + "BecarioExterno/Delete/" + Id;
            return $http.delete(endPoint);
        }
        service.deleteAdjuntoBecarioExterno = function (Id) {
            var endPoint = API + "BecarioExterno/DeleteAdjuntoBecarioExterno/" + Id;
            return $http.delete(endPoint);
        }

        //Services for edit the formacionAcademica
        //Here we will can put some services add it
        service.getFormacionAcadId = function (id) {
            var endPoint = API + "BecarioExterno/GetById/" + id;
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

        service.updateValidacion = function (registroBecario) {
            var endpoint = API + "BecarioExterno/UpdateSolicitud/" + registroBecario;
            return $http.put(endpoint, registroBecario);
        }


        service.AddSolicitud = function (Registro) {
            var endPoint = API + "Solicitud/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }

        service.mailNotificacion = function (Registro) {
            var endPoint = API + "Correo/SendNotificacion?block=no";
            return $http.post(endPoint, Registro);
        }

        service.updateSolicitud = function (registro) {
            var endpoint = API + "Solicitud/UpdateEstado/" + registro;
            return $http.put(endpoint, registro);
        }

        service.AddBitacoraSolicitud = function (Registro) {
            var endPoint = API + "BitacoraSolicitudes/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }

        service.ValidaRegistroDuplicado = function (obj) {
            var endPoint = API + "BecarioExterno/ValidarDuplicados";
            return $http.post(endPoint,obj);
        }

        //service.AddFile = function (Registro) {
        //    var request = $http({
        //        method: "post",
        //        url: API + "AdjuntoCursos/Create/",
        //        headers: { 'Content-Type': 'application/json' },
        //        data: Registro
        //    });
        //    return request;
        //}

        service.GetEstanciasDeInvestigadoresEnInstituto = function (clave) {
            var endPoint = API + "BecarioExternoINEEL/GetEstanciasDeInvestigadoresEnInstituto/" + clave;
            return $http.get(endPoint);
        }

        return service;

    }

})();