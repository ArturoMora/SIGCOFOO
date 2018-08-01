(function () {
    "use strict";

    angular
        .module("ineel")
        .controller("suscripcionCtrl", ["$scope", "$state", "AuthService",
            "MenuService", "PersonaService", "NuevoOCService",
            "DTOptionsBuilder", '$log', '$uibModal', '$filter', suscripcionCtrl]);

    function suscripcionCtrl($scope, $state, AuthService,
        MenuService, PersonaService, NuevoOCService,
        DTOptionsBuilder, $log, $uibModal, $filter) {
        $scope.idRol = MenuService.getRolId();
        $scope.respons = [];
        $scope.message = "";

        $scope.authentication = AuthService.authentication;
        var clavePersona = AuthService.authentication.userprofile.clavePersona;

      //  $scope.dtOptions = DTOptionsBuilder
      //.newOptions()     
      //  $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);
        $scope.dtOptions = DTOptionsBuilder
         .newOptions()
         .withOption('order', [1, 'asc'])
         .withOption('displayLength', 10)        
         .withOption('responsive', true);
      //.withOption('responsive', true);
        $scope.registros = [];
        $scope.registrosTmp = [];
        $scope.cargaTabla= function(){
            NuevoOCService.GetAllByEmpleado(clavePersona).then(
               function (result) {
                   $scope.registros = [];
                   $scope.registrosTmp = result.data;
                   var tmp = result.data;
                   if (tmp != null) {
                       var black = false;
                       for (var i = 0; i < tmp.length; i++) {
                           black = $filter('BlackListOC')(tmp[i].oCsRolesBlackList, $scope.idRol);
                           if (!black) {
                               $scope.registros.push(tmp[i]);
                           }
                       }
                   }
                   console.log(result);
               },
               function (error) {
                   $scope.registros = [];
                   console.log(error);
               }
           );
        }
        $scope.cargaTabla();

       // $scope.isSelected = false;
        $scope.onText = 'Si';
        $scope.offText = 'No';
        $scope.isActive = true;
        $scope.size = 'normal';
        $scope.animate = true;
        $scope.radioOff = false;
        $scope.handleWidth = "auto";
        $scope.labelWidth = "auto";
        

        //$scope.$watch('isSelected', function () {
        //    $log.info('Selection changed.');
        //});

        //$scope.toggle = function () {
        //    $scope.isSelected = $scope.isSelected === true ? false : true;
        //};

        //$scope.setUndefined = function () {
        //    $scope.isSelected = undefined;
        //};

        //$scope.toggleActivation = function () {
        //    $scope.isActive = !$scope.isActive;
        //}

        $scope.saveEstado = function (e) {
            var id = e.ocsId;
            var estado = e.isSuscrito;
            var descripcion = e.nombre;

            $scope.descripcionRow = descripcion;
            $scope.message = "&#191;Desea dejar de estar suscrito al OC: <strong>" + $scope.descripcionRow + "</strong>?";
            $scope.elemento = e;
            var pagina;
            var _estado;
            var registro;
            if (estado == true) {
                pagina = "Active";
                $scope.message = "&#191;Desea suscribirte al OC: <strong>" + $scope.descripcionRow + "</strong>&#63;";
                _estado = true;
            } else {
                pagina = "Delete";
                _estado = false;
            }
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/Confirmacion.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        e.isSuscrito = _estado;                        
                        NuevoOCService.UpdateSuscripcion(clavePersona,e).then(
                            function (result) {
                                console.log(result);
                                toastr.success(result.data);
                                $scope.cargaTabla();
                                $uibModalInstance.dismiss('cancel');
                            },
                            function (error) {
                                console.log("UpdateSuscripcion");
                                console.log(error);
                                toastr.error("error al procesar la solicitud");
                                $scope.cargaTabla();
                                $uibModalInstance.dismiss('cancel');
                            }
                        );
                       
                    };
                    $scope.cancel = function () {
                        $scope.cargaTabla();
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        }
    }
}());