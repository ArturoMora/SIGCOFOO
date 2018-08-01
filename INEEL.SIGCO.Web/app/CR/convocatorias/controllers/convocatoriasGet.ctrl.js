(function () {
    "use strict";

    angular
        .module("ineelCR")
        .controller("ConvocatoriasGetCtrl", [
            "$scope",
            "$state",
            "$filter",
            "DTOptionsBuilder",
            "DTColumnDefBuilder",
            "ConvocatoriasCRService",
            "$uibModal",
            "MenuService",
            ConvocatoriasGetCtrl
        ]);

    function ConvocatoriasGetCtrl($scope, $state, $filter, DTOptionsBuilder, DTColumnDefBuilder,  ConvocatoriasCRService, $uibModal, MenuService) {
        
        $scope.conv = {};
        $scope.busqueda = false;
        $scope.limpia = false;

        $scope.convocatorias = {};
        $scope.idRol = MenuService.getRolId();



        $scope.VarRetorno = MenuService.OrigenInicioConvocatoriaGet();
      
        

        //Lista de nombres de convocatorias
        ConvocatoriasCRService.GetNombresTipoConvocatoria().then(function (res) {
            $scope.tipoConvocatorias = res.data;
        }, function (err) {
            toastr.error("Error al cargar los datos de tipos de convocatorias");
            console.log(err);
        });


        //Lista de los nombres de los fondos
        ConvocatoriasCRService.GetListaNombreFondosPrograma().then(function (res) {
            $scope.fondosPrograma = res.data;
        }, function (err) {
            toastr.error("Error al cargar los datos de fondos");
            console.log(err);
        });
        

        $scope.buscar = function () {
            if ( ($scope.conv.fechaInicioComparacion != null || $scope.conv.fechaInicioComparacion != undefined) &&  //en caso de que la fecha de inicio esta definida pero no la final
                ($scope.conv.fechaFinalComparacion == null || $scope.conv.fechaFinalComparacion == undefined) ) {

                $scope.conv.fechaFinalComparacion = new Date();
                $scope.conv.busquedaFecha="ok";
            }
            if ( ($scope.conv.fechaFinalComparacion != null || $scope.conv.fechaFinalComparacion != undefined) && //en caso de que la fecha final este definida pero no la inicial
                 ($scope.conv.fechaInicioComparacion == null || $scope.conv.fechaInicioComparacion == undefined) ) {

                $scope.conv.fechaInicioComparacion = new Date(1975, 10, 25);
                $scope.conv.busquedaFecha="ok";
            }
            if (($scope.conv.fechaInicioComparacion != null && $scope.conv.fechaFinalComparacion != null) && $scope.conv.fechaInicioComparacion > $scope.conv.fechaFinalComparacion) {
                toastr.error("Favor de introducir un rango válido de fechas");
                return false;
            }
            ConvocatoriasCRService.GetConsultaParametrizadaConvocatoria($scope.conv).then(function (res) {
                $scope.convocatorias = res.data;
                $scope.convocatorias = Object.keys($scope.convocatorias)
                    .map(function(key) {
                    return $scope.convocatorias[key];
                });
                $scope.busqueda = true;
            }, function (err) {
                toastr.error("Error al cargar los datos de fondos");
                console.log(err);
            });

        }

        //Se recuperan los datos de la previa busqueda ingresada por el usuario
        $scope.conv = MenuService.getVariable('busquedaConvocatorias');
        if ($scope.conv == null) {
            $scope.conv = {};
            $scope.paramsDT = {};
            $scope.paramsDT.displayStart = 0;
        } else {
            $scope.paramsDT = JSON.parse(localStorage.getItem('CRconvocatoriasGet' + window.location.pathname)); //Recuperamos los parametros de filtrado en el DT
            if ($scope.paramsDT == null) {
                $scope.paramsDT = {};  //Puede que sean nulos, en dado caso se mostrara la pagina 1
                $scope.paramsDT.displayStart = 0;
            }
            $scope.buscar();
            MenuService.deleteVariable('busquedaConvocatorias');
        }

        $scope.reset = function () {
            $scope.busqueda = false;
            $scope.limpia = true;
            $scope.conv = {};
        };


        $scope.PonEnCero = function () {
            MenuService.OrigenInicioConvocatoriaReset();
        }

        $scope.detalleRegistro = function (id) {
            MenuService.setVariable('busquedaConvocatorias', $scope.conv);
            $state.go('convocatoriaDetails', { id: id });
        }

        $scope.editarRegistro = function (id) {
            MenuService.setVariable('busquedaConvocatorias', $scope.conv);
            $state.go('convocatoriaEdit', { id: id });
        }

        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('stateSaveCallback', stateSaveCallback)
            .withOption('stateLoadCallback', stateLoadCallback)
            .withOption('displayStart', $scope.paramsDT.displayStart)

        function stateSaveCallback(settings, data) {
            var stado = $('#CRconvocatoriasGet').DataTable().state();
            localStorage.setItem('CRconvocatoriasGet' + window.location.pathname, JSON.stringify(stado))
        }

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
                return JSON.parse(localStorage.getItem('CRconvocatoriasGet' + window.location.pathname))
            }

        }



        //Importante
        //Las siguientes lineas permiten que el filtrado default de un datatable funcione, ya que durante todo el desarrollo del sigco no funcionaban (hasta ahora \(*u*)/ )
        //El filtrado no funciona cuando dentro de un <td> hay elementos html, como  lo son <a></a> , <div></div>, etc
        $scope.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef([0]).withOption('type', 'string') //definimos el tipo de datos de cada columna
        ];


        $scope.eliminarRegistro=function(id){
            ConvocatoriasCRService.DeleteConvocatoriaWithFKS(id).then(function(res){
                $scope.buscar();
                toastr.success(res.data);
            }, function(err){
                toastr.error("Error al intentar eliminar el registro");
                console.log(err);
            });
        }
        


        //cambia el estado del registro
        $scope.saveEstado = function (convocatoria) {
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/registroLogico' + (convocatoria.estado == true ? 'Active' : 'Delete') + '.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        ConvocatoriasCRService.UpdateEstado(convocatoria).then(
                            function (result) {

                            },
                            function (err) {
                                $scope.cancel();
                            });
                        $uibModalInstance.close();
                    };
                    $scope.cancel = function () {
                        var idx = ($scope.convocatorias.indexOf(convocatoria));
                        $scope.convocatorias[idx].estado = !$scope.convocatorias[idx].estado;
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }


    }


})();