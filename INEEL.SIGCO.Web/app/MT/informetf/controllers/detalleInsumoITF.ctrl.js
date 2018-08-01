(function () {
    "use strict";

    angular
    .module("ineelMT")
    .controller("detalleInsumoITFCtrl", [
        "AuthService",
        "$rootScope",
        "$scope",
        "$state",
        "$stateParams",
        "buscarInsumosService",
        "globalGet",
        "$uibModal",
        "comunService",
        "AdminMT",
        "MenuService",
        detalleInsumoITFCtrl
    ]);

    function detalleInsumoITFCtrl(AuthService, $rootScope, $scope, $state, $stateParams, buscarInsumosService, globalGet, $uibModal, comunService, AdminMT, MenuService) {
        debugger;
        var publico = 1;
        var reservado = 2;
        var id = $rootScope.getGlobalID(); //$stateParams.id;
        var tipoInformacion = 22; //22: Insumo
        $scope.publico = false;
        $scope.controlAcceso = "Reservado";
        var esAdmin = MenuService.getRolId() == AdminMT; //MenuService.getMenuMT()[0].idRol == AdminMT;
        
        $scope.solicitudExistente = false;
        $scope.registro = {};
        $scope.publico = false;
        $scope.autorizado = false;
        $scope.jefeHiperonimo = false;
        $scope.authentication = AuthService.authentication;
        var personaId = AuthService.authentication.userprofile.clavePersona;
        var roles = AuthService.authentication.userprofile.roles;
        var API = globalGet.get("api");


      

        //$scope.urlDescarga = API.concat("Descarga/GetFile");
        $scope.urlDescarga = API + "Descarga/GetFile";

        $scope.isJefe = function () {
            debugger;

            $scope.jefeHiperonimo = esAdmin;
            if ($scope.jefeHiperonimo == true) {
                $scope.publico = true;
            }

            debugger;
            if ($scope.registro.tipoAcceso == 1) {
                $scope.publico = true;
            }
            var empleado = "";
            debugger;
            if (($scope.registro.informeTecnicoFinal.proyecto.numjefeProyecto != null && $scope.registro.informeTecnicoFinal.proyecto.numjefeProyecto == personaId) || esAdmin) {
                $scope.jefeHiperonimo = true;
                $scope.publico = true;
            } else {
                var Jerarquia = {
                    UnidadOrganizacionalId: $scope.registro.informeTecnicoFinal.proyecto.unidadOrganizacionalId,
                    JefeHiperonimo: personaId
                };
                comunService.isJefeHiperonimoByUnidadOrganizacionalId(Jerarquia).then(
                    function (result) {
                        if ($scope.jefeHiperonimo==false) {
                            $scope.jefeHiperonimo = result.data;
                        }
                        
                        if ($scope.publico == false && $scope.registro.tipoAcceso != 1) {
                            $scope.publico = result.data;
                        }
                        $scope.solicitudPendiente();
                    },
                    function (error) { }
                );
            }


        }

        buscarInsumosService.getInsumo(id).then(
            function (result) {
                $scope.registro = result.data;

                debugger;
                if ($scope.registro.tipoAccesoIns == 1)  //False es privado, True es publico || 1 publico 2 reservado
                {
                    $scope.isJefe();
                    $scope.publico = true;
                    $scope.controlAcceso = "Publico";

                } else {
                    $scope.isJefe();
                }
            },
            function (err) {
                console.error(err);
            });
        
        $scope.eliminar = function (registro) {
            //alert(id);
            console.log("registro:");
            console.log(registro);
            console.log("registro<");
            $scope.descripcionRow = registro.nombreIns;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {

                        $scope.delete(registro.insumosId, $uibModalInstance);
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };
        $scope.delete = function (idInsumo, $uibModalInstance) {
            buscarInsumosService.DeleteInsumo(idInsumo).then(
						function (result) {
						    $uibModalInstance.dismiss('close');
						    toastr.success(result.data);
						    $rootScope.globalRegresar();
						},
						function (error) {
						    try{
                                toastr.error(error.data.message);
                                $uibModalInstance.dismiss('close');
						    }catch(e){}
						}
					);
        };
        


    }
})();