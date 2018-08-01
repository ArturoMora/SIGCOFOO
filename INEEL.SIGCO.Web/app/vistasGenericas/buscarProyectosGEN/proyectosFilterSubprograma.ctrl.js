(function () {
    "use strict";
    angular
        .module("ineel.controllers")
        .controller("ProyectosFilterSubprogramaCtrl", [
        "$scope",
        "$compile",
        "globalGet",
        "buscarProyectosPorSubprogramaService",
        "$uibModalInstance",
        "DTColumnBuilder",
        "DTOptionsBuilder",
        "authInterceptorService",
        ProyectosFilterSubprogramaCtrl]);

    function ProyectosFilterSubprogramaCtrl($scope, $compile,globalGet, buscarProyectosPorSubprogramaService, $uibModalInstance, DTColumnBuilder, DTOptionsBuilder, authInterceptorService) {
        $scope.click = false;
        $scope.nueva = true;
        $scope.proyectoInput = {};
        $scope.proyecto = {};
        $scope.proyectos = [];
        $scope.proyectoSelect = {};
        var contador = 0;
        var API = globalGet.get("api");
        var tabla = this;
        tabla.dtInstance = {};
        tabla.registros = [];
        var headers = authInterceptorService.requestServerSide(); //importante para la consulta server side
        
        /****IMPORTANTE */
        /***Por default el modal myuestra todos los proyectos que tiene cargada la base de datos, si se desea filtrar los proyectos por subprogramas
         * entonces (en el controlador del cual se hace la llamada a este modal) agregar una propiedad que contenga los subprogramas, como el siguiente ejemplo:
         * $scope.subprogramasProyecto="61,62,63"   <========El back recibe esa lista y hace un split por las comas que separadoras, 
         * Solo definir la propiedad en caso de desear filtrar los proyectos, caso contrario no es necesario crearla
         */
        if ($scope.subprogramasProyecto != null) {
            $scope.proyectoInput.subprogramasProyecto = $scope.subprogramasProyecto; //Estas propiedades vienen del controlador de donde llamaron al modal de busqueda de proyectos
            $scope.moduloBusqueda= $scope.modulo;
        } else {
            $scope.proyectoInput.subprogramasProyecto = null;
        }

        function createdRow(row, data, dataIndex) { //Hace el binding de las acciones que se definan por cada fila , ejemplo, cuando en la tabla se tiene un ngclick por cada registro
            $compile(angular.element(row).contents())($scope);
        }

        function actionsHtml(data, type, full, meta) {
            tabla.registros[data.proyectoId] = data; //se guardan los registros en un array, ya que en server side el ng-click no funciona 
            return '<td>' +
                '<a class="link" style="cursor:pointer" ng-click="ok({id:&#39;' + data.proyectoId + '&#39;' + '} )" >'  //&#39; es una comilla
                        //'<a class="link" ng-click="ok(' + data.proyectoId + ',' + data.nombre + ',' + data.claveUnidad + ',' + data.numjefeProyecto + ')">'
                            + data.proyectoId +
                         '</a>' +
            '</td>'
        }

        tabla.dtColumns = [
            DTColumnBuilder.newColumn(null).withTitle('Número del proyecto').renderWith(actionsHtml).withOption('responsivePriority', '1'), //En este caso como la primer columna tiene una accion se usa la opcion renderWith
            DTColumnBuilder.newColumn("nombre", "Nombre del proyecto").withOption('defaultContent', '') //el primer atributo dentro de newColum es la variable recuperada del json, el otro es el nombre que se muestra al usuario
        ];

        $scope.loadTable = function () {
            tabla.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', { //Peticion de tipo ajax
                dataSrc: function (d) {

                    return d.data; //Cuando termina la consulta los devuelve
                },
                headers: headers, //Debido a que el server side se brinca el servicio authinterceptor se tiene que inyectar manualmente los datos de la sesion, de lo contrario no se puede acceder al back
                //IMPORTANTE atributos de entidad en el mismo orden en que se muestran para saber por que columna se quiere ORDENAR los datos
                data: {
                    "nameColumns": "proyectoId;nombre", //nombre de las columnas de la tabla en la bd por las que se buscara la info
                    "proyectoId": $scope.proyectoInput.ProyectoId, // atributos de busqueda, los cuales se recuperan desde el front y se asignan a variables de la clase DataServerSide.cs
                    "NombreProyecto": $scope.proyectoInput.Nombre,
                    "SubprogramasProyecto": $scope.proyectoInput.subprogramasProyecto,
                    "moduloBusqueda" : $scope.moduloBusqueda
                },
                url: API + "Proyectos/getData", //Metodo del back donde se recuperan los datos
                type: "POST", //peticion tipo post, debido a que mandamos datos a buscar
                error: function (err) {
                    try {
                        //$scope.errorGetData = true;
                        console.log(err);
                        toastr.error(err.statusText);
                    } catch (e) { }
                }
            }).withOption('processing', true) //for show progress bar
            .withOption('serverSide', true) // for server side processing
            .withPaginationType('full_numbers') // opciones de paginacion // first / last / prev / next and page numbers        
            .withDisplayLength(5) // Numero de registros a mostrar
            .withOption('aLengthMenu', [[5, 10, 20, 50], [5, 10, 20, 50]])  //Cuantos elementos a la vez se pueden mostrar
            .withOption('aaSorting', [0, 'asc']) // for default sorting column // here 0 means first column
            .withOption('language', { sSearch: "Filtrar palabra o frase:" }) //caja de busqueda
            .withOption('createdRow', createdRow);//Hace el binding de la vista con el controlador
        }


        $scope.buscar = function (proyectoInput) {
            $scope.contador = 0;
            $scope.click = true;
            $scope.nueva = false;
            $scope.loadTable();
        
            $scope.proyectoInput={};
        }

        $scope.ok = function (objeto) {
            
            var proyecto = tabla.registros[objeto.id];
            $uibModalInstance.close(proyecto);
            //tabla.registros[data.proyectoId] = data;
            
        }
        $scope.cancel=function() {
            $uibModalInstance.close();
        }

        $scope.loadTable();


    }
})();