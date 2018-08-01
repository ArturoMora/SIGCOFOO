(function () {
    "use strict";

    angular.module("ineelCH")
        .controller("busquedaAvanzadaEmpCtrl", ["AuthService", "$scope", "gestionfichasService", "$filter", "$uibModal", "$sce", "blockUI", "$timeout", busquedaAvanzadaEmpCtrl]);


    function busquedaAvanzadaEmpCtrl(AuthService, $scope, gestionfichasService, $filter, $uibModal, $sce, blockUI, $timeout) {
        //Obtener los servicios de autenticacion
        $scope.authentication = AuthService.authentication;

        $scope.parametro = {};  //Parametro usado para desplegar modales
        $scope.filtro = {}; //Variable de validacion de campos 

        $scope.muestraResultados = false;
        $scope.cantidadRegistros = 0;

        /******Variables de los checkbox's, por default se cargan todos los registros */
        $scope.cargaOpcionesDefault = function () {
            $scope.dataArray = [];  //Contador de ocs

            /*****Filtros default */
            $scope.filtro.muestraTodos = false;
            $scope.filtro.personal = 2;  ///Por default se muestra personal activo e inactivo, [0: inactivo, 1: activo, 2: todos]
            $scope.filtro.publicaciones = true;
            $scope.filtro.ponencias = true;
            $scope.filtro.proyectos = true;
            $scope.filtro.cursos = true;
            $scope.filtro.derechos = true;
            $scope.filtro.propiedad = true;
            $scope.filtro.formacion = true;

            /***Busqueda default */
            $scope.opciones = "";
            $scope.opciones = "SEMBLANZA FORMACION-ACADEMICA PUBLICACIONES PONENCIAS PROYECTOS PROPIEDAD-INDUSTRIAL CURSOS DERECHOS-AUTOR ";  //Contiene los campos por los que el usuario acota la info, por default busca en todas las categorias
            /////NOTA: importante dejar el espacio al final de la cadena
        }

        $scope.cargaOpcionesDefault();

        //Carga el modal con el detalle de los registros
        $scope.cargarDetalle = function (tipoOC, lista) {
            // $scope.parametro.clavePersona=clave;  //Clave de la persona
            $scope.parametro.tipoOC = tipoOC; //Tipo de OC
            $scope.parametro.busquedaInicial = $scope.criterio;  //Busqueda inicial
            $scope.parametro.listaId = lista;

            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/detallesBusquedaPersonal/detallesBusquedaPersonalGEN.html',
                controller: 'DetallesBusquedaPersonalGENCtrl',
                size: 'lg',
                scope: $scope
            });
        }

        //Carga el modal con el detalle de los registros
        $scope.cargarSemblanzaProfesional = function (clavePersona) {
            $scope.parametro.clavePersona = clavePersona;
            $scope.parametro.busquedaInicial = $scope.criterio;  //Busqueda inicial

            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/detallesBusquedaPersonal/detalleSemblanzaPersonalGEN.html',
                controller: 'detalleSemblanzaPersonalCtrl',
                size: 'lg',
                scope: $scope
            });
        }


        /****Para el label que muestra la cantidad de registros filtrados [ej: mostrando 25 registros de 40] */
        $scope.obtenerCantidad = function (estado) {
            if (estado == 2) {  //1 para activos, 0 para inactivos y 2 para todos
                /***Activa el checkbox */
                var radio = document.getElementById("radio" + estado);
                radio.checked = true;
                $scope.filtro.mostrarTodos = true;
                $scope.filtro.personal = 2;
                $scope.cantidadRegistros = $scope.resultados.length;
            } else {
                /***Activa el checkbox */
                var radio = document.getElementById("radio" + estado);
                radio.checked = true;
                $scope.filtro.mostrarTodos = false;
                $scope.filtro.personal = estado;
                var datos = $filter('filter')($scope.resultados, function (item) {
                    return item.datosPersona.estado == estado;
                });
                $scope.cantidadRegistros = datos.length;
            }
        }

        //A partir de una lista pre-procesada obtiene el contador de categorias por OC  (los iconos verdes que muestran el total de ponencias, articulos, etc)
        $scope.obtieneContadoresCategorias = function (categoria) {  //Categoria es el parametro por el cual filtrar la informacion
            var contadorCategoria = 0;
            if ($scope.dataArray.length == 0) {  //En caso de que no haya lista pre-procesada se debera de llamar al metodo para procesar la informacion
                $scope.preFiltroContadoresCategorias(); //La lista se tiene que depurar, debido a que es una lista de  arrays sobre arrays
            }

            //Doble ciclo debido a que la lista preprocesada es de 2 dimensiones
            for (var c = 0; c < $scope.dataArray.length; c++) { //En este momento esta lista solo tiene registros de los ocs de la busqueda en general
                for (var d = 0; d < $scope.dataArray[c].length; d++) {
                    var dato = $scope.dataArray[c];
                    if (dato[d].fieldC == categoria) { //si en esa posicion hay un registro que coincida con la categoria buscada entonces se cuenta
                        contadorCategoria += parseInt(dato[d].fieldB);
                    }
                }
            }
            return contadorCategoria;
        }

        //Hace un preprocesado de la lista general de resultados, para posteriormente contabilizar los OCs
        $scope.preFiltroContadoresCategorias = function () {
            $scope.dataArray = [];
            var datos = $filter('filter')($scope.resultados, function (item) {
                $scope.dataArray.push(item.ocs);
            });
        }


        //Busqueda de informacion dados los parametros
        $scope.buscar = function (criterio, opciones) {
            
            if (criterio!= undefined) {
                blockUI.start("Buscando en la base de datos ..."); //Mensajes que se muestran cuando el usuario esta esperando una respuesta
                $timeout(function () {
                    blockUI.message('refinando resultados ...');
                }, 1000);

                var parametros = {
                    'criterio': criterio,
                    'opciones': opciones,
                };

                gestionfichasService.busquedaAvanzada(parametros).then(
                    function (result) {
                        $scope.resultados = result.data;
                        $scope.muestraResultados = true;
                        $scope.obtenerCantidad($scope.filtro.personal);   //Por default el personal activo
                        $scope.preFiltroContadoresCategorias();
                        blockUI.stop();
                    },
                    function (err) {
                        toastr.error("No se ha podido cargar la información solicitada");
                    }
                );
            }else{
                toastr.error("Ingrese un criterio de búsqueda")
            }
        }

        //Agrega opciones de busqueda
        $scope.cambiaOpcion = function (opcion) {
            $scope.opciones += opcion + " ";
            $scope.buscar($scope.criterio, $scope.opciones);
        }

        //Quita una opcion de la lista por la cual buscar
        $scope.quitaOpcion = function (opcion) {
            $scope.opciones = $scope.opciones.replace(new RegExp('(' + opcion + ' ' + ')', "gi"), "");  //, 'gi'
            var cadena = $scope.opciones.replace(/ /g, '');

            if (cadena.length == 0) {  //Si el usuario desmarca todos los checkbox por default se hara la busqueda inicial
                $scope.cargaOpcionesDefault();
                var parametros = {
                    'criterio': $scope.criterio,
                    'opciones': $scope.opciones,
                };
            }
            $scope.buscar($scope.criterio, $scope.opciones);
        }

        $scope.limpiar = function () {
            $scope.criterio = null;
            $scope.muestraResultados = false;
        }







    }
})();