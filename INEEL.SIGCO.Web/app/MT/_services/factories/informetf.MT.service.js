/*
AYUDA:
FooEntities.- la entidad en plural, e.j.: Empleados
FooID.-  es el ID del modelo (ID de la tabla)
FooController.- el controlador de WebAPI
itfsService nombre de factory en ENTITIES.service.js
"ineelMT.services".- referencia a /app/_services/*.service.js
*/
(function () {
    "use strict";
    
    var app = angular.module("ineel.MT.services");
    app.factory("itfsService", ["$http", "globalGet", itfsService]);

    function itfsService($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        var API = globalGet.get("api");
        var service = {};
        service.updateSolicitud = function (registro) {
            var endpoint = API + "Solicitud/UpdateEstado/" + registro;
            return $http.put(endpoint, registro);
        }
        service.getAllsolicitudesITF = function () {
            var endPoint = API + "Solicitud/getAllsolicitudesITF";
            return $http.get(endPoint);
        }
        // Get 
        service.getByID = function (FooID) {
            var endpoint = API + "InformeTecnicoFinal/get/" + FooID;
            return $http.get(endpoint);
        }
        service.GetByID_Collections = function (FooID) {
            //var endpoint = API + "InformeTecnicoFinal/GetByID_Collections/" + FooID;
            var endpoint = API + "InformeTecnicoFinal/GetFKs/" + FooID;
            
            return $http.get(endpoint);
        }
        
        service.getProyectosPropios = function (numJefe) {
            var endpoint = API + "InformeTecnicoFinal/GetProyectsByNumJefe/" + numJefe;
            return $http.get(endpoint);
        }
        service.getProyecto = function (id) {
            var endpoint = API + "InformeTecnicoFinal/getProyecto/" + id;
            return $http.get(endpoint);
        }

        service.getFKs = function (usuario) {
            var endpoint = API + "InformeTecnicoFinal/GetFKs/" + usuario;
            return $http.get(endpoint);
        };
        

        // Update
        service.update = function (model) {
            var endpoint = API + "InformeTecnicoFinal/update";
            return $http.put(endpoint, model);
        }

        // Create
        service.create = function (model) {
            var endpoint = API + "InformeTecnicoFinal/create";
            return $http.post(endpoint, model);
        }
        service.CreateSolicitudAccesoITF = function (model) {
            var endpoint = API + "InformeTecnicoFinal/CreateSolicitudAccesoITF";
            return $http.post(endpoint, model);
        }
        service.AddSolicitud = function (Registro) {
            var endPoint = API + "Solicitud/Create";
            return $http.post(endPoint, Registro);
        }
        service.AddBitacoraSolicitud = function (Registro) {
            var endPoint = API + "BitacoraSolicitudes/Create";
            return $http.post(endPoint, Registro);
        }
        service.Persona = function (clave) {
            var endPoint = API + "Personas/GetByClave/" + clave;
            return $http.get(endPoint);
        }

        service.enviarARevision = function (id) {
            var endpoint = API + "InformeTecnicoFinal/enviarARevision/"+id;
            return $http.post(endpoint, id);
        }
        service.aprobacion1 = function (id) {
            var endpoint = API + "InformeTecnicoFinal/aprobacion1/" + id;
            return $http.post(endpoint, id);
        }
        service.RechazaAprobacion1 = function (id) {
            var endpoint = API + "InformeTecnicoFinal/RechazaAprobacion1/" + id;
            return $http.post(endpoint, id);
        }
        service.CreateFirst = function (model) {
            debugger;
            var endpoint = API + "InformeTecnicoFinal/CreateFirst";
            return $http.post(endpoint, model);
        }

        // Get FooEntities
        service.get = function () {
            var endpoint = API + "InformeTecnicoFinal/GetAll";
            return $http.get(endpoint);
        };
        service.getByUser = function (usuario) {
            var endpoint = API + "InformeTecnicoFinal/GetAll/" + usuario;
            return $http.get(endpoint);
        };

        // Delete
        service.delete = function (itf) {
            var endpoint = API + "InformeTecnicoFinal/delete";
            return $http.post(endpoint, itf);
        }

        service.PublicarITF = function (model) {
            var endpoint = API + "InformeTecnicoFinal/PublicarITF";
            return $http.post(endpoint, model);
        }
        service.isJefeHiperonimo = function (model) {
            var endpoint = API + "Jerarquia/isJefeHiperonimo";
            return $http.post(endpoint, model);
        }
        
        service.CorreoCreateSolicitudAccesoITF = function (model) {
            var endpoint = API + "Correo/SendNotificacion?block=no";
            return $http.post(endpoint, model);
        }
        
        service.GetBySolicitudAttrs = function (model) {
            var endpoint = API + "Solicitud/GetBySolicitudAttrs";
            return $http.post(endpoint, model);
        }
        service.ExisteSolicitudAccesoITFByInformeTecnicoFinal_Solicitante_estadoFlujo = function (model) {
            var endpoint = API + "InformeTecnicoFinal/ExisteSolicitudAccesoITFByInformeTecnicoFinal_Solicitante_estadoFlujo";
            return $http.post(endpoint, model);
        }
        service.BitacoraITFConsulta_Create = function (model) {
            var endpoint = API + "BitacoraITFConsulta/Create";
            return $http.post(endpoint, model);
        }
        service.BitacoraITFDescarga_Create = function (model) {
            var endpoint = API + "BitacoraITFDescarga/Create";
            return $http.post(endpoint, model);
        }
        service.sendCorreo = function (model) {
            var endpoint = API + "Correo/SendNotificacion";
            return $http.post(endpoint, model);
        }
        service.GetNameEmpresaAndUnidadByProyect = function (model) {
            var endpoint = API + "Empresas/GetNameEmpresaAndUnidadByProyect";
            return $http.post(endpoint, model);
        }
        service.DeleteAdjuntoITF = function (model) {
            var endpoint = API + "InformeTecnicoFinal/deleteAdjuntoITF";
            return $http.post(endpoint, model);
        }
        service.getTipoInsumo = function () {
            var endpoint = API + "TipoInsumo/GetAllByEstadoDisponible";
            return $http.get(endpoint);
        }
        service.getTipoAcceso = function () {
            var endpoint = API + "TipoAcceso/GetAllByEstadoDisponible";
            return $http.get(endpoint);
        }
        service.CountNumeroProyectoConITF = function (proyectoId) {
            var endpoint = API + "InformeTecnicoFinal/CountNumeroProyectoConITF";
            return $http.post(endpoint, proyectoId);
        }
        service.getAllByProyecto = function (proyectoId) {
            var endpoint = API + "InformeTecnicoFinal/getAllByProyecto/"+proyectoId;
            return $http.get(endpoint);
        }

        service.getAllByClaveEmpleado = function (empleado) {
            var endpoint = API + "InformeTecnicoFinal/getAllByClaveEmpleado/" + empleado;
            return $http.get(endpoint);
        }
        service.getAllAutores = function (idITF) {
            var endpoint = API + "InformeTecnicoFinal/getAllAutores/" + idITF;
            return $http.get(endpoint);
        }
        service.DeleteAutor = function (model) {
            var endpoint = API + "InformeTecnicoFinal/DeleteAutor"
            return $http.post(endpoint,model);
        }
        service.AddAutor = function (model) {
            var endpoint = API + "InformeTecnicoFinal/AddAutor"
            return $http.post(endpoint, model);
        }
        service.AddAdjuntoPrincipal = function (model) {
            var endpoint = API + "InformeTecnicoFinal/AddAdjuntoPrincipal"
            return $http.post(endpoint, model);
        }

        service.AddAdjuntoCalidad = function (model) {
            var endpoint = API + "InformeTecnicoFinal/AddAdjuntoCalidad"
            return $http.post(endpoint, model);
        }


        service.CountITFByProyecto = function (idProyecto) {
            var endpoint = API + "InformeTecnicoFinal/CountITFByProyecto/"+idProyecto
            return $http.get(endpoint);
        }
        service.GetGerenteAutorizadorByIDITF = function (idITF) {
            var endpoint = API + "InformeTecnicoFinal/GetGerenteAutorizadorByIDITF/" + idITF
            return $http.get(endpoint);
        }
        
        
        return service;

    }

}());