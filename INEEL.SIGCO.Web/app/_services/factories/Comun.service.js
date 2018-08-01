(function () {
    "use strict";

    angular
        .module("ineel.services")
        .factory('comunService', ['$http', '$q', 'globalGet', comunService]);

    function comunService($http, $q, globalGet) {
        var API = globalGet.get("api");
        
        var service = {};
        
        service.UnidadOrganizacional = {};
        service.UnidadOrganizacional.GetNameById = function (id) {
            var endpoint = API + "UnidadOrganizacional/GetNameById/" + id;
            return $http.get(endpoint);
        };

        service.UnidadOrganizacional.GetPadreById = function (id) {
            var endpoint = API + "UnidadOrganizacional/GetPadreUnidad/" + id;
            return $http.get(endpoint);
        };

        service.isJefeHiperonimo = function (model) {
           
            var endpoint = API + "Jerarquia/isJefeHiperonimo";
            return $http.post(endpoint, model);
        }
        service.isJefeHiperonimoByUnidadOrganizacionalId = function (model) {
           
            var endpoint = API + "Jerarquia/isJefeHiperonimoByUnidadOrganizacionalId";
            return $http.post(endpoint, model);
        }
        service.SolicitudAcceso = function (unidadId,estadoFlujoId) {
          
            var endpoint = API + "SolicitudAcceso/GetAllByUnidadWithEstadoFlujo/" + unidadId + "/" + estadoFlujoId;
            return $http.get(endpoint);
        }
        service.SolicitudAccesoTop = function (unidadId, estadoFlujoId, top) {
            
            var endpoint = API + "SolicitudAcceso/GetAllByUnidadWithEstadoFlujoTop/" + unidadId + "/" + estadoFlujoId+"/"+top;
            return $http.get(endpoint);
        }
        

        service.solicitarAcceso = function (model) { /*Esta es la llamada COMUN para registrar una solicitud de ACCESO*/
            var endpoint = API + "SolicitudAcceso/Create"
            return $http.post(endpoint, model);
        }
        service.AddBitacoraSolicitud = function (Registro) {
            var endPoint = API + "BitacoraSolicitudes/Create";
            return $http.post(endPoint, Registro);
        }
        service.AddBitacoraSolicitudesAcceso = function (Registro) {
            var endPoint = API + "BitacoraSolicitudesAcceso/Create" ;
            return $http.post(endPoint, Registro);
        }
        service.mailNotificacion = function (Registro) {
            var endPoint = API + "Correo/SendNotificacion?block=no";
            return $http.post(endPoint, Registro);
        }
        service.AutorizaResponsableUnidadGEN = function (SolicitudAccesoId) {
            var endpoint = API + "SolicitudAcceso/AutorizaResponsableUnidadGEN/" + SolicitudAccesoId;
            return $http.post(endpoint);
        }
        service.RechazaResponsableUnidadGEN = function (SolicitudAccesoId) {
            var endpoint = API + "SolicitudAcceso/RechazaResponsableUnidadGEN/" + SolicitudAccesoId;
            return $http.post(endpoint);
        }
        
        service.existeSolicitudByPersonaInformOCIdANDestadoFlujo = function (personaId, InformacionOCId, estadoFlujoId) {
            
            var endpoint = API + "SolicitudAcceso/existeSolicitudByPersonaInformOCIdANDestadoFlujo/" + personaId + "/" + InformacionOCId + "/" + estadoFlujoId;
            return $http.get(endpoint);
        }

        service.listaBanners = function () {
            var endpoint = API + "Upload/listaBanners/";
            return $http.get(endpoint);
        }
        
        service.consultarinvestigadoreshome = function () {
            var endPoint = API + "InventarioRH/InvestigadoresHome";
            return $http.get(endPoint);
        }
        service.getOCtopRaw = function (cantTotal) {
            var endPoint = API + "NuevoOC/getOCtopRaw/"+cantTotal;
            return $http.get(endPoint);
        }

        service.getOCtopRaw = function (cantTotal) {
            var endPoint = API + "NuevoOC/getOCtopRaw/" + cantTotal;
            return $http.get(endPoint);
        }


        service.existeSolicitudAcceso = function (ClavePersonaSolicitante, InformacionOCId, EstadoFlujoId) {
            
            var endPoint = API + "SolicitudAcceso/ExisteSolicitud/" + ClavePersonaSolicitante + "/" + InformacionOCId + "/" + EstadoFlujoId;
            return $http.get(endPoint);
        }



        service.Solicitud = function (ClavePersonaSolicitante, InformacionOCId, EstadoFlujoId) {

            var endPoint = API + "SolicitudAcceso/SolicitudDeAcceso/" + ClavePersonaSolicitante + "/" + InformacionOCId + "/" + EstadoFlujoId;
            return $http.get(endPoint);
        }


        service.borrarSolicitud = function (id) {
            var endPoint = API + "SolicitudAcceso/Delete/" + id;
            return $http.delete(endPoint);
        }


        service.BitacoraSolicitudesAcceso = function (id) {
            var endPoint = API + "BitacoraSolicitudesAcceso/GetBySolicitudAccesoId/" + id;
            return $http.get(endPoint);
        }
        service.PersonalProyecto_GetByClave = function (noEmpleado, numEmpleado) {
            var endPoint = API + "PersonalProyecto/PersonalProyecto_GetByClave/" + noEmpleado+"/"+numEmpleado;
            return $http.get(endPoint);
        }
        ////Agregar registro 
        service.addPersonalProyectoReturn = function (Registro) {
            var endPoint = API + "PersonalProyecto/CreateReturn";
            return $http.post(endPoint,Registro);
        }
        service.getOfUrl = function (uri) {
            var endPoint = API + "Descarga/getUrl";
            var url = uri;
            var body = { cadena: url };
            var x = $http.post(endPoint, body);

            return x;
        }

        service.validarExistencia = function (Registro) {
            var endPoint = API + "ValidacionExist/validarExistencia";
            return $http.post(endPoint, Registro);
        }

        service.ValidacionExist = function (Registro) {
            var endPoint = API + "ValidacionExist/validar";
            return $http.post(endPoint, Registro);
        }

        service.ValidacionExistCR = function (Registro) {
            var endPoint = API + "ValidacionExist/validarCR";
            return $http.post(endPoint, Registro);
        }
        service.ValidacionExistCP = function (Registro) {
            var endPoint = API + "ValidacionExist/validarCP";
            return $http.post(endPoint, Registro);
        }
        service.getMovimientoPuesto = function (claveEmpleado) {
            var endPoint = API + "MovimientoPuesto/GetAllByClaveEmpleado/" + claveEmpleado;
            return $http.get(endPoint);
        }

        service.getMovimientoUnidadOrg = function (claveEmpleado) {
            var endPoint = API + "MovimientoUnidadOrg/GetAllByClaveEmpleado/" + claveEmpleado;
            return $http.get(endPoint);
        }
        service.getMovimientoCategoria = function (claveEmpleado) {
            var endPoint = API + "MovimientoCategoria/GetAllByClaveEmpleado/" + claveEmpleado;
            return $http.get(endPoint);
        }
        service.proyectos_countGroupByUnidad = function (anio) {
            var endPoint = API + "Proyectos/countGroupByUnidad/" + anio;
            return $http.get(endPoint);
        }

        
        
        service.proyectos_FacturacionPlaneadaGroupByUnidad= function (anio) {
            var endPoint = API + "Proyectos/FacturacionPlaneadaGroupByUnidad/" + anio;
            return $http.get(endPoint);
        }
        service.proyectos_FacturacionRealGroupByUnidad = function (anio) {
            var endPoint = API + "Proyectos/FacturacionRealGroupByUnidad/" + anio;
            return $http.get(endPoint);
        }

        //Relacionado con la vista de proyectos del sigco
        service.GetDatosProyectoForModal = function (id) {
            var endPoint = API + "Proyectos/GetDatosProyectoForModal/" + id;
            return $http.get(endPoint);
        }

        service.GetEmpresaWithImagen = function (id) {
            var endPoint = API + "Empresas/GetEmpresaWithImagen/" + id;
            return $http.get(endPoint);
        }
        
        //Crea un registro de la solicitud de acceso al itf, para de esta manera mostrar una leyenda al momento de descargar los itfs
        service.CreateRegistroBitacoraSolicitudes=function(obj){
            var endPoint = API + "BitacoraITFSolicitudDescarga/Create";
            return $http.post(endPoint, obj);
        }

        //obtiene el permiso de descarga de un itf
        service.GetRegistroBitacora=function(id){
            var endPoint = API + "BitacoraITFSolicitudDescarga/GetBySolicitud/"+id;
            return $http.get(endPoint);
        }

        //actualiza el permiso de descarga de un itf
        service.updateRegistroBitacoraSolicitudes=function(obj){
            var endPoint = API + "BitacoraITFSolicitudDescarga/Update";
            return $http.put(endPoint,obj);
        }

        //actualiza el permiso de descarga de un itf
        service.UpdatePermisoDescarga=function(obj){
            var endPoint = API + "BitacoraITFSolicitudDescarga/UpdatePermisoDescarga";
            return $http.put(endPoint,obj);
        }
        //obtiene la solicitud del itf por persona solicitante
        service.GetSolicitudITF=function(obj){
            var endPoint = API + "SolicitudAcceso/GetSolicitudByItf";
            return $http.post(endPoint, obj);
        }

        return service;
    }

//foo


})();