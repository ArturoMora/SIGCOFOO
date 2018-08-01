(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("FondosProgramaGetCtrl", [
            "$scope",
            "$state",
            "DTOptionsBuilder",
            "DTColumnDefBuilder",
            "FondosProgramaCRService",
            "$uibModal",
            "MenuService",
            FondosProgramaGetCtrl
        ]);

    function FondosProgramaGetCtrl($scope, $state, DTOptionsBuilder, DTColumnDefBuilder, FondosProgramaCRService, $uibModal, MenuService) {
        $scope.idRol = MenuService.getRolId();
        $scope.fp = {};   //Guarda los parametros que ingrese el usuario para buscar X fondo o programa
        $scope.busqueda = false;
        $scope.limpia = false;

        $scope.buscar = function () {
            if (($scope.fp.fechaInicioComparacion != null || $scope.fp.fechaInicioComparacion != undefined) &&  //en caso de que la fecha de inicio esta definida pero no la final
                ($scope.fp.fechaFinalComparacion == null || $scope.fp.fechaFinalComparacion == undefined)) {

                $scope.fp.fechaFinalComparacion = new Date();
                $scope.fp.busquedaFecha="ok";
            }
            if (($scope.fp.fechaFinalComparacion != null || $scope.fp.fechaFinalComparacion != undefined) && //en caso de que la fecha final este definida pero no la inicial
                ($scope.fp.fechaInicioComparacion == null || $scope.fp.fechaInicioComparacion == undefined)) {

                $scope.fp.fechaInicioComparacion = new Date(1975, 10, 25);
                $scope.fp.busquedaFecha="ok";
            }
            if (($scope.fp.fechaInicioComparacion != null && $scope.fp.fechaFinalComparacion != null) && $scope.fp.fechaInicioComparacion > $scope.fp.fechaFinalComparacion) {
                toastr.error("Favor de introducir un rango válido de fechas");
                return false;
            }
            FondosProgramaCRService.GetConsultaParametrizadaFondo($scope.fp).then(function (res) {
                $scope.fondos = res.data;
                $scope.busqueda = true;
            }, function (err) {
                toastr.error("Error al cargar los datos de los fondos");
                console.log(err);
            })
        }


        //Se recuperan los datos de la previa busqueda ingresada por el usuario
        $scope.fp = MenuService.getVariable('busquedaFondoPrograma');
        if ($scope.fp == null) {
            $scope.fp = {};
            $scope.paramsDT = {};
            $scope.paramsDT.displayStart = 0;
        } else {
            $scope.paramsDT = JSON.parse(localStorage.getItem('CRfondosProgramaGet' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
            if ($scope.paramsDT == null) {
                $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
                $scope.paramsDT.displayStart = 0;
            }
            $scope.buscar();
            MenuService.deleteVariable('busquedaFondoPrograma');
        }


        //Para la lista de empresas
        FondosProgramaCRService.GetNombresEmpresa().then(function (res) {
            $scope.empresas = res.data;
        }, function (err) {
            toastr.error("Error al cargar los datos de las empresas");
            console.log(err);
        })

        //Para la lista de fuentes de financiamiento
        FondosProgramaCRService.GetNombresFuentesFinanciamiento().then(function (res) {
            $scope.fuentes = res.data;
        }, function (err) {
            toastr.error("Error al cargar los datos de las fuentes de financiamiento");
            console.log(err);
        })

        $scope.eliminarRegistro= function(id){
            FondosProgramaCRService.DeleteFondoWithFKS(id).then(
                function(res){
                    $scope.buscar();
                    toastr.success(res.data);
                },function(err){
                    toastr.error("Error al intentar eliminar el registro");
                    console.log(err);
                }
            );
        }

        $scope.mostrarAlerta=function(){
            toastr.error("El fondo tiene convocatorias asociadas, elimine cada una primero");
        }

        $scope.editarRegistro = function (id) {
            MenuService.setVariable('busquedaFondoPrograma', $scope.fp);
            $state.go('fondoProgramaEdit', { id: id });
        }

        $scope.detalleRegistro = function (id) {
            MenuService.setVariable('busquedaFondoPrograma', $scope.fp);
            $state.go('fondoProgramaDetails', { id: id });

        }

        $scope.detalleConvocatorias = function (id) {
            MenuService.setVariable('busquedaFondoPrograma', $scope.fp);
            $state.go('convocatoriaDetailsByFP', { id: id });

        }

        $scope.reset = function () {
            $scope.busqueda = false;
            $scope.limpia = true;
            $scope.fp = {};
        };

        //opciones para el datatable
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('displayStart', $scope.paramsDT.displayStart)

        //guarda el estado del dt por cada accion ejecutada
        function stateSaveCallback(settings, data) {
            var stado = $('#CRfondosProgramaGet').DataTable().state();
            localStorage.setItem('CRfondosProgramaGet' + window.location.pathname, JSON.stringify(stado))
        }

        //carga el estado del dt, se ejecuta en conjunto con el stateSaveCallback
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
                return JSON.parse(localStorage.getItem('CRfondosProgramaGet' + window.location.pathname))
            }

        }

        //cambia el estado del registro
        $scope.saveEstado = function (fondo) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + (fondo.estado == true ? 'Active' : 'Delete') + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        FondosProgramaCRService.UpdateEstado(fondo).then(
                            function (result) {

                            },
                            function (err) {
                                $scope.cancel();
                            });
                        $uibModalInstance.close();
                    };
                    $scope.cancel = function () {
                        var idx = ($scope.fondos.indexOf(fondo));
                        $scope.fondos[idx].estado = !$scope.fondos[idx].estado;
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }

        //Importante
        //Las siguientes lineas permiten que el filtrado default de un datatable funcione, ya que durante todo el desarrollo del sigco no funcionaban (hasta ahora \(*u*)/ )
        //El filtrado no funciona nativamente cuando dentro de un <td> hay elementos html, como  lo son <a></a> , <div></div>, etc
        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef([0,1]).withOption('type', 'string') //definimos el tipo de datos de cada columna
        ];


    }


})();