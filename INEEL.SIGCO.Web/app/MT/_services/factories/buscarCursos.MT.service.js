
(function () {
    "use strict";

    angular
        .module("ineel.MT.services")
        .factory("buscarCursosService", ["$http", "globalGet", buscarCursosService]);

    function buscarCursosService($http, globalGet) {
        //endpoint hace referencia al consumo del WebAPI, no es indispensable respetar minusculas y mayusculas
        var API = globalGet.get("api");
        var service = {};

        service.getTipoCurso = function () {
            var endPoint = API + "TipoCurso/GetAll";
            return $http.get(endPoint);
        }
        
        //Busca por palabra
        service.GetWord = function (Palabra) {
            var post = false;
            var model = {};
            if (Palabra.Autor != '' && Palabra.Autor != undefined) {
                var endpoint = API + "AutorInternoCursoInterno/GetAutor/" + Palabra.Clave;
            }
            if (Palabra.Titulo != '' && Palabra.Titulo != undefined) {
                var endpoint = API + "CursoInterno/GetTitulo/" + Palabra.Titulo;
            }
            if (Palabra.proyecto.selected != undefined) {
                var endpoint = API + "CursoInterno/GetProy/" + Palabra.proyecto.selected.proyectoId;
            }
            if (Palabra.FechaInicio != '' && Palabra.FechaInicio != undefined) {
                //var pal = Palabra.FechaInicio.toString.Format('dd-MM-yyyy');
                //pal = "01-09-2016";
                //var dia = Palabra.FechaInicio.getDate(); 
                //var mes = Palabra.FechaInicio.getMonth()+1;
                //var anio = Palabra.FechaInicio.getFullYear();
                //var pal = dia+"-"+mes+"-"+anio;
                var endpoint = API + "CursoInterno/GetFecIni";
                model = { fecha: Palabra.FechaInicio };
                post = true;
            }
            //if (Palabra.FechaTermino!= '') {
            //    var endpoint = API + "AutorInternoCursoInterno/GetFecTer/" + Palabra.FecTer;
            //}
            if (Palabra.TipoCurso != ''&& Palabra.TipoCurso!=undefined) {
                var endpoint = API + "CursoInterno/GetTipo/" + Palabra.TipoCurso;
            }
            //var endpoint = API + "AutorInternoCursoInterno/GetAutor/" + Palabra;
            if (!post) {
                return $http.get(endpoint);
            } else {
                return $http.post(endpoint, model);
            }
            
        }

        //obtener registro 
        service.getbyid = function (id) {
            var endPoint = API + "CursoInterno/GetById/" + id;
            return $http.get(endPoint);
        }

        service.Persona = function (clave) {
            var endPoint = API + "Personas/GetByClaveFechaEfectiva/" + clave;
            return $http.get(endPoint);
        }
        service.GetUO = function (clave) {
            var endPoint = API + "UnidadOrganizacional/GetById/" + clave;
            return $http.get(endPoint);
        }

        service.getExt = function (id) {
            var endPoint = API + "AutorInternoCursoInterno/GetExtById/" + id;
            return $http.get(endPoint);
        }

        service.getByObj = function (id) {
            var endPoint = API + "AutorInternoCursoInterno/GetByObj/" + id;
            return $http.get(endPoint);
        }

        service.getAdjuntos = function (id) {
            var endPoint = API + "AdjuntoCursos/GetByIdOK/" + id;
            return $http.get(endPoint);
        }

        //Lee ese insumo de la tabla de solicitudes
        service.GetPermiso = function (Registro) {
            var endPoint = API + "Solicitud/GetPermiso/" + Registro;
            return $http.post(endPoint, Registro);
        }

        //Da acceso al Jefe
        service.AutJefe = function (Registro) {
            var endpoint = API + "Jerarquia/isJefeHiperonimoDeProyecto/" + Registro;
            return $http.post(endpoint, Registro);
        }

        //Lee por nombre de jefe
        service.GetResponsableByUnOr = function (UnOr) {
            var endpoint = API + "Personas/GetResponsableByClaveUnidadWithoutStatus/" + UnOr;
            return $http.get(endpoint);
        }

        //Lee por nombre de jefe
        service.GetByRol = function (id) {
            var endpoint = API + "RolPersona/GetByRolForsolicitud/" + id;
            return $http.get(endpoint);
        }

        service.mailNotificacion = function (Registro) {
            var endPoint = API + "Correo/SendNotificacion/" + Registro;
            return $http.post(endPoint, Registro);
        }

        service.AddSolicitud = function (Registro) {
            var endPoint = API + "Solicitud/UpdateCreate/" + Registro;
            return $http.post(endPoint, Registro);
        }


        service.AddBitacora = function (Registro) {
            var endPoint = API + "BitacoraSolicitudes/Create/" + Registro;
            return $http.post(endPoint, Registro);
        }

        return service;


    }

}());