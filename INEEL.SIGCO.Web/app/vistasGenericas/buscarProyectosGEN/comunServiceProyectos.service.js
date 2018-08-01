(function () {
    "use strict";

    angular
        .module("ineel.services")
        .factory('ComunServiceProyectos', ['$http', '$q', 'globalGet', ComunServiceProyectos]);

    function ComunServiceProyectos($http, $q, globalGet) {
        var API = globalGet.get("api");

        var service = {};

        service.UnidadOrganizacional = {};

        // Obtener DA by Id
        service.getdabyid = function (id) {
            var endpoint = API + "DerechosAutor/GetById/" + id;
            return $http.get(endpoint);
        };

 
        service.PersonalProyecto_GetByClave = function (noEmpleado, numEmpleado) {
            var endPoint = API + "PersonalProyecto/PersonalProyecto_GetByClave/" + noEmpleado + "/" + numEmpleado;
            return $http.get(endPoint);
        }
        ////Agregar registro 
        service.addPersonalProyectoReturn = function (Registro) {
            var endPoint = API + "PersonalProyecto/CreateReturn";
            return $http.post(endPoint, Registro);
        }
    
        service.proyectos_countGroupByUnidad = function (anio) {
            var endPoint = API + "Proyectos/countGroupByUnidad/" + anio;
            return $http.get(endPoint);
        }
        service.proyectos_FacturacionPlaneadaGroupByUnidad = function (anio) {
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
        //Obtener todos los insumos y sus adjuntos
        service.GetLASinProyecto = function (id) {
            var endPoint = API + "InformeTecnicoFinal/GetLASinProyecto/" + id;
            return $http.get(endPoint);
        }
        service.GetInsumosPublicosPorProyecto = function (id) {
            var endPoint = API + "InformeTecnicoFinal/GetInsumosPublicosPorProyecto/" + id;
            return $http.get(endPoint);
        }
        //personal por proyecto
        service.GetPersonasPorProyecto = function (id) {
            var endPoint = API + "PersonalProyecto/GetPersonasPorProyecto/" + id;
            return $http.get(endPoint);
        }

        //publicaciones por proyecto
        service.GetPublicacionsByProyecto = function (id) {
            var endPoint = API + "Publicacion/GetByPublicacionesByProyecto/" + id;
            return $http.get(endPoint);
        }

        //ponencias por proyecto
        service.GetPonenciasByProyecto = function (id) {
            var endPoint = API + "Ponencia/GetByProyecto/" + id;
            return $http.get(endPoint);
        }

        //DA por proyecto
        service.GetDerechosAutorByProyecto = function (id) {
            var endPoint = API + "DerechosAutor/GetByProyecto/" + id;
            return $http.get(endPoint);
        }

        //PI por proyecto
        service.GetPropiedadIndustrialByProyecto = function (id) {
            var endPoint = API + "PropiedadIndustrial/GetByProyecto/" + id;
            return $http.get(endPoint);
        }

        //obtener detalles sobre propiedad industrial y tipo de propiedad
        service.getDetallesPropiedadIndustrial = function (id) {
            var endPoint = API + "PropiedadIndustrial/GetByIdYTipoPropiedad/" + id;
            return $http.get(endPoint);
        }

        //obtener detalles sobre propiedad industrial y tipo de propiedad
        service.GetFondosByProyecto = function (id) {
            var endPoint = API + "FondosPrograma/GetFondosByProyecto/" + id;
            return $http.get(endPoint);
        }

        //obtener productos innovadores
        service.getProductosInnovadores = function (id) {
            var endPoint = API + "ProductoGI/GetByProyectos/" + id;
            return $http.get(endPoint);
        }

        //Detalle producto innovador
        service.getdetallesProductosInnovadores = function (id) {
            var endPoint = API + "ProductoGI/GetById/" + id;
            return $http.get(endPoint);
        }

        return service;
    }

    //foo


})();