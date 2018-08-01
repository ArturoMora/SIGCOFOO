
(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("AgregaBecasPersonalAddCtrl", [
            "AuthService",
            "$scope",
            "$state",
            "$timeout",
            "MenuService",
            "InformeBecarioCHService",
            "globalGet",
            "$filter",
            "$uibModal",
            "DTOptionsBuilder",
            "DTColumnBuilder",
            "$compile",
            "$rootScope",
            "authInterceptorService", AgregaBecasPersonalAddCtrl]);

    function AgregaBecasPersonalAddCtrl(AuthService, $scope, $state, $timeout, MenuService, InformeBecarioCHService, globalGet, $filter, $uibModal, DTOptionsBuilder, DTColumnBuilder, $compile, $rootScope,authInterceptorService) {

        $scope.datePicker = getRangoDeFechaDefault(0, 0, 10);
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;
        $scope.busqueda = {}; //scope global
        var tablaBecariosExternos = this;
        $scope.mostrarTabla = false;
        $scope.limpia = false;
        $scope.eliminaRelacion = false;
        $scope.buscaBecario = false;

        tablaBecariosExternos.dtInstance = {};
        tablaBecariosExternos.registros = [];
        $scope.fichaPersonaEdicion = {};

        // $scope.busqueda.institucionId=232;

        var headers = authInterceptorService.requestServerSide();
        //$scope.fichaPersonaEdicion = MenuService.getVariable('gestionFichaPersonal');
        
        if ($rootScope.GestionFichasClave == null) {
            $scope.fichaPersonaEdicion.nombreEmpleado = $scope.authentication.nombreCompleto;
            $scope.fichaPersonaEdicion.numeroEmpleado = $scope.authentication.userprofile.clavePersona;

        } else {
            $scope.fichaPersonaEdicion.nombreEmpleado = $rootScope.GestionFichasNombre;
            $scope.fichaPersonaEdicion.numeroEmpleado = $rootScope.GestionFichasClave;

        }

        function createdRow(row, data, dataIndex) {
            return $timeout(function () {
                // Recompiling so we can bind Angular directive to the DT
                return $compile(angular.element(row).contents())($scope);
            }, 0);


        }

        //Becario Interno
        tablaBecariosExternos.dtColumns = [
            DTColumnBuilder.newColumn(null).withTitle('Becario').renderWith(renderColumnaBecario).withOption('responsivePriority', '1'),
            DTColumnBuilder.newColumn("tipoBeca", "Tipo beca").withOption('defaultContent', ''),
            DTColumnBuilder.newColumn("institucion", "Instituci&oacute;n").withOption('defaultContent', ''),
            DTColumnBuilder.newColumn("tituloEstancia", "Tema de estancia").withOption('defaultContent', ''),
            DTColumnBuilder.newColumn("nombreAsesor", "Asesor").withOption('defaultContent', ''),
            DTColumnBuilder.newColumn("fechaInicio", "Per&iacute;odo").withOption('defaultContent', '').renderWith(renderColumnaFecha),
            DTColumnBuilder.newColumn(null).withTitle('Opciones').renderWith(actionsHtml).withClass('thAjuste text-center').notSortable().withOption('responsivePriority', '2')
        ];


        $scope.loadTablaBecariosExternos = function () {

            tablaBecariosExternos.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
                dataSrc: function (d) {
                    return d.data;
                },
                headers: headers,
                //IMPORTANTE atributos de entidad en el mismo orden en que se muestran para saber por que columna se quiere ORDENAR los datos
                data: {
                    "nameColumns": "becarioId;tipoBeca;institucion;tituloEstancia;nombreAsesor;fechaInicio",
                    //Existe una clase llamada DataServerSide.cs, donde contiene varias propiedades que pueden ser utilizadas para enviar parametros al backend
                    "Autor": $scope.busqueda.claveAsesor,  //usaremos la propiedad autor para enviar la propiedad asesor(del front) al back
                    "Becario": $scope.busqueda.nombreBecario,
                    "Institucion": $scope.busqueda.institucionId,
                    "NuevaFechaInicio": $filter('date')($scope.busqueda.fechaInicio, 'dd/MM/yyyy'),//$filter('date')($scope.busqueda.FechaInicio, 'dd/MM/yyyy')
                    "NuevaFechaTermino": $filter('date')($scope.busqueda.fechaTermino, 'dd/MM/yyyy'),//$filter('date')($scope.busqueda.FechaTermino, 'dd/MM/yyyy')
                    "TipoBeca": $scope.busqueda.tipoBecaId,
                    "BusquedaFecha": $scope.busqueda.busquedaFecha,
                    "Tipo": "Validados"  //solo becarios con estado de registro 3, validados
                },
                url: API + "BecarioExternoINEEL/getData",
                type: "POST",
                error: function (err) {
                    try {
                        console.log(err);
                        toastr.error(err);
                    } catch (e) { }
                }
            }).withOption('processing', true) //for show progress bar
                .withOption('serverSide', true) // for server side processing
                .withPaginationType('full_numbers') // for get full pagination options // first / last / prev / next and page numbers        
                .withDisplayLength(5) // Page size
                .withOption('aLengthMenu', [[5, 10, 20, 50], [5, 10, 20, 50]])
                .withOption('aaSorting', [1, 'desc']) // for default sorting column // here 0 means first column
                .withOption('language', { sSearch: "Filtrar:" })
                .withOption('stateSaveCallback', stateSaveCallback) //guarda el estado del datatable (DT)
                .withOption('stateLoadCallback', stateLoadCallback) //carga el estado del DT
                .withOption('displayStart', $scope.paramsDT.displayStart)
                .withOption('createdRow', createdRow);//IMPORTANTE para ng-click
        }



        $scope.buscar = function () {
            $scope.mostrarTabla = false;
            if (($scope.busqueda.fechaInicio != null || $scope.busqueda.fechaInicio != undefined) &&  //en caso de que la fecha de inicio esta definida pero no la final
                ($scope.busqueda.fechaTermino == null || $scope.busqueda.fechaTermino == undefined)) {

                $scope.busqueda.fechaTermino = new Date();
                $scope.busqueda.busquedaFecha = "ok";
            }
            if (($scope.busqueda.fechaTermino != null || $scope.busqueda.fechaTermino != undefined) && //en caso de que la fecha final este definida pero no la inicial
                ($scope.busqueda.fechaInicio == null || $scope.busqueda.fechaInicio == undefined)) {

                $scope.busqueda.fechaInicio = new Date(1975, 10, 25);
                $scope.busqueda.busquedaFecha = "ok";
            }
            if ($scope.busqueda.fechaTermino != null && $scope.busqueda.fechaInicio != null) {
                $scope.busqueda.busquedaFecha = "ok";
            }

            tablaBecariosExternos.dtOptions = [];
            $scope.loadTablaBecariosExternos();
            $scope.mostrarTabla = true;
        }

        var mensajeConfirmacionAsociacion = "¿Seguro de <b>asociar</b> este registro al empleado <b> " + $scope.fichaPersonaEdicion.nombreEmpleado + " </b> ?"
        var mensajeConfirmacionDesasociacion = "¿Seguro de <b>eliminar</b> la relación de este registro con el empleado <b>" + $scope.fichaPersonaEdicion.nombreEmpleado + "</b> ?"

        function actionsHtml(data, type, full, meta) {
            var esPersonaNula = data.clavePersona == null ? true : false;
            var esPersonaAsociada = data.clavePersona == $scope.fichaPersonaEdicion.numeroEmpleado ? true : false;

            return '<td>' +
                '<a class="btn btn-success" ng-show="' + !esPersonaAsociada + ' || ' + esPersonaNula + ' " ng-really-click="asociaRegistroConEmpleado(' + data.becarioId + ',' + data.clavePersona + ')" ng-really-message="' + mensajeConfirmacionAsociacion + '" title="Relacionar registro con empleado">'
                + '<i class="glyphicon glyphicon-plus"></i> Asociar registro' +
                '</a>'
                + '<a class="btn btn-danger" ng-show="' + esPersonaAsociada + '" ng-really-click="eliminaRelacion=true;asociaRegistroConEmpleado(' + data.becarioId + ');" ng-really-message="' + mensajeConfirmacionDesasociacion + '" title="Eliminar relacion del registro con el empleado">'
                + '<i class="glyphicon glyphicon-trash"></i> Eliminar asociación' +
                '</a>' +
                '</td>';
        }

        //Funcion para renderizar la primer columna de la tabla
        function renderColumnaBecario(data, type, full, meta) {
            return '<td>' +
                '<a ng-click="setVariable(' + '&#39;' + 'consultaInformesBecariosAddAdmin' + '&#39;' + ', busqueda)" ui-sref="InformeBecarioDetails({id: ' + data.becarioId + '})" title="Detalles">'
                + data.claveBecario + ' - '
                + data.nombreBecario +
                '</a>'
            '</td>'
        }

        //Funcion para renderizar la columna de las fechas
        function renderColumnaFecha(data, type, row, meta) {
            var fechaInicio = $filter('date')(row.fechaInicio, 'dd/MM/yyyy');
            var fechaTermino = $filter('date')(row.fechaTermino, 'dd/MM/yyyy');

            fechaInicio == null ? 'No disponible' : fechaInicio;
            fechaTermino == null ? 'No disponible' : fechaTermino;

            return fechaInicio + ' - ' + fechaTermino;

        }

        //Resetea el formulario de busqueda
        $scope.reset = function () {
            $scope.busqueda = {};
            $scope.mostrarTabla = false;
            $scope.limpia = true;
        }

        //modal instituciones
        $scope.openInstituciones = function () {

            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/listainstituciones.html',
                controller: function ($scope, $uibModalInstance) {
                    $scope.institucion = {};
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    }

                    $scope.ok = function (item) {
                        $uibModalInstance.close(item);
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.busqueda.nombreInstitucion = selectedItem.descripcion;
                $scope.busqueda.institucionId = selectedItem.institucionID;
            });

        }

        //Modal de personal ineel 
        $scope.openAsesor = function () {
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/PersonasFilterGet.html',
                controller: 'PersonasFilterGetCtrl',
                scope: $scope,
            });
            modalInstance.result.then(function (selectedItem) {

                $scope.busqueda.nombreAsesor = selectedItem.nombreCompleto;
                $scope.busqueda.claveAsesor = selectedItem.clavePersona;

            });
        }

        //Agrega o elimina una asociacion de un registro con un empleado
        $scope.asociaRegistroConEmpleado = function (id, clavePersona) {
            if ($scope.fichaPersonaEdicion != null) {
                MenuService.setVariable('consultaInformesBecariosAddAdmin', $scope.busqueda);
                var datoEmpleado = $scope.fichaPersonaEdicion.numeroEmpleado;
                if ($scope.eliminaRelacion) {
                    datoEmpleado = null;
                }

                InformeBecarioCHService.ActualizaRegistroBecaEmpleado(id, datoEmpleado).then(
                    function (res) {
                        toastr.success(res.data);
                        $state.reload();
                        $scope.eliminaRelacion = false;
                    }, function (err) {
                        toastr.error(err.data);
                        console.log(err);
                    }
                );
            } else {
                toastr.error("Error: no se puede asociar el registro al empleado");
                return false;
            }
        }

        //Tipos de beca por los cuales se puede filtrar la informacion
        InformeBecarioCHService.getTipoBecas().then(function (res) {
            $scope.becas = res.data;
        }, function (err) {
            toastr.error("Error al carga los tipos de becas");
            console.log(err);
        });

        //catalogo de tipos de instituciones
        InformeBecarioCHService.getInstituciones().then(
            function (result) {
                $scope.instituciones = result.data;
            },
            function (err) {
                toastr.error("No se ha podido cargar el catalogo de instituciones");
                console.log(err);
            }
        );

        //***********Funciones para guardar manualmente el estado del datatable**********************\\

        //Se recuperan los datos de la previa busqueda ingresada por el usuario
        $scope.busqueda = MenuService.getVariable('consultaInformesBecariosAddAdmin');
        if ($scope.busqueda == null) {
            $scope.busqueda = {};
            $scope.paramsDT = {};
            $scope.paramsDT.displayStart = 0;
            // $timeout($scope.buscar(), 0);
        } else {
            $scope.paramsDT = JSON.parse(localStorage.getItem('tablaBecasExternasAddAdmin' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
            if ($scope.paramsDT == null) {
                $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
                $scope.paramsDT.displayStart = 0;
            }
            $timeout($scope.buscar(), 0);
            MenuService.deleteVariable('consultaInformesBecariosAddAdmin');
        }



        //Por cada accion del Datatable se ejecuta este callback
        function stateSaveCallback(settings, data) {
            var stado = $('#tablaBecasExternasAddAdmin').DataTable().state();
            localStorage.setItem('tablaBecasExternasAddAdmin' + window.location.pathname, JSON.stringify(stado))
        }

        //En conjunto con el callback anterior se guarda y recupera el state del datatatable
        function stateLoadCallback(settings) {
            if ($scope.paramsDT != null && $scope.limpia) {
                $scope.paramsDT = {};
                $scope.paramsDT.displayStart = 0;
                $scope.limpia = false;
                return $scope.paramsDT;
            }
            if ($scope.paramsDT != null) {
                return $scope.paramsDT;
            } else {
                return JSON.parse(localStorage.getItem('tablaBecasExternasAddAdmin' + window.location.pathname))
            }

        }



    }
})();
