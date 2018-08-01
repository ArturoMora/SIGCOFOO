(function () {
    "use strict";

    angular
    .module("ineelMT")
    .controller("editarInsumoITFCtrl", [
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
        "itfsService",
        "uploadFileACH",
        "AdjuntoITFInsumoService",
        editarInsumoITFCtrl
    ]);

    function editarInsumoITFCtrl(AuthService, $rootScope, $scope, $state, $stateParams, buscarInsumosService,
        globalGet, $uibModal, comunService, AdminMT, MenuService, itfsService, uploadFileACH, AdjuntoITFInsumoService) {
        debugger;
        var publico = 1;
        var reservado = 2;
        var id = $rootScope.getGlobalID(); //$stateParams.id;
        var tipoInformacion = 22; //22: Insumo
        $scope.publico = false;
        $scope.selectTipo = [];
        $scope.TipoInsumo = [];
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
        itfsService.getTipoAcceso().then(
            function (result) {
                console.log("foo1");
                $scope.selectTipo = result.data;//aqui
                console.log($scope.selectTipo);
            },
            function (err) {
                console.error(err);
          });
        itfsService.getTipoInsumo().then(
            function (result) {
                $scope.TipoInsumo = result.data;//aqui
            },
            function (err) {
                console.error(err);
        });
        $scope.loadRegistro = function () {
            buscarInsumosService.getInsumo(id).then(
            function (result) {
                $scope.registro = result.data;

              
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
        }
        $scope.loadRegistro();
        
        //Buscar Persona
        $scope.PersonaSeleccionada = {};
        $scope.verpersona = false;
        debugger;
        $scope.openResponsable = function () {
            debugger;
            $scope.desabilitarBuscarResponsable = true;
            $scope.empleado = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/PersonasFilterGet.html',
                controller: 'PersonasFilterGetCtrl',
                resolve: {
                    empleado: function () {
                        $scope.verpersona = false;
                        return $scope.empleado;
                    }
                },
                scope: $scope,
            });
            modalInstance.result.then(function (selectedItem) {
                var compara = angular.equals($scope.claveBecario, selectedItem.clavePersona);
                if (compara == true) {
                    toastr.error("El becario y asesor no debe ser el mismo");
                    return false;
                }
                else {
                    $scope.registro.responsableIns = selectedItem.nombreCompleto;
                    //$scope.registroBecario.asesor_ClavePersona = selectedItem.clavePersona;
                    //$scope.registroBecario.asesor_Nombre = selectedItem.nombreCompleto;
                    //$scope.PersonaSeleccionada = selectedItem;
                }
            });
            $scope.desabilitarBuscarResponsable = false;
        }

        $scope.update = function (registro) {
            buscarInsumosService.Update(registro).then(
						function (result) {
						    
						    toastr.success(result.data);
						    $rootScope.globalRegresar();
						},
						function (error) {
						    try{
						        toastr.error(error.data.message);
						    }catch(e){}
						}
					);
        };
        
        $scope.eliminarAdjunto = function (index, adjuntoITFInsumo) {
            if ($scope.registro.adjuntoITFInsumo.length > 1) {            
                $scope.message = "&#191;Se eliminar&aacute; de forma permanente el adjunto con nombre <strong>" + adjuntoITFInsumo.adjunto.nombre + "</strong>&#63;";
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/Confirmacion.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        AdjuntoITFInsumoService.deleteAdjuntoITFInsumo(adjuntoITFInsumo.adjuntoITFInsumoId).then(
                            function (result) {                               
                                $uibModalInstance.dismiss('cancel');
                                $scope.registro.adjuntoITFInsumo.splice(index, 1);
                            },
                            function (error) { toastr.error("error al eliminar el elemento"); $uibModalInstance.dismiss('cancel'); }
                        );
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
            } else {
                toastr.error("Se requiere por lo menus un adjunto para el insumo", "Adjunto requerido en el insumo");
            }
        }


        $scope.getFileDetailsInsumos = function (adjunto) {
            $scope.files = [];
            $scope.files.push(adjunto.files[0]);
            debugger;
            // $scope.uploadFiles();
            var propiedades = {
                file: adjunto.files[0],
                ext: "*",
                type: Date.now(),
                size: '8',
                api: API + "FileUploadMT/UploadFiles/"
            }
            console.log("fil::");
            console.log(propiedades.file);
            $scope.message = "Se agregar&aacute; el adjunto con nombre <strong>" + propiedades.file.name + "</strong><br/> &#191;Est&aacute; seguro de actualizar el insumo, agregando este adjunto&#63;";
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/Confirmacion.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        uploadFileACH.upload(propiedades,
                        function (err, result) {
                            if (!err) {
                                console.log("result:");
                                console.log(result);
                                debugger;
                                if (!result.error) {
                                    updateProgressInsumos(result);
                                } else {
                                    toastr.error(result.message);
                                }
                            } else {
                                var error = err.message || "Error al adjuntar";
                                toastr.error(error);
                            }
                            debugger;
                        });
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });

        };

        // CONFIRMATION.        
        function updateProgressInsumos(result) {
            debugger
            console.log(result);
            $scope.$apply(function () {
                //alert(result.nameFile);
                if (!result.error) {

                  var newAdjunto = {
                        "adjunto": { "rutaCompleta": result.fullPathFile, "nombre": result.nameFile, "moduloId": "MT" },
                        "insumosId": $scope.registro.insumosId
                    }
                    AdjuntoITFInsumoService.AddAdjuntoITFInsumo(newAdjunto).then(
                        function (result) {         
                            $(":file").filestyle('clear');
                            $scope.loadRegistro();
                        },
                        function (error) { toastr.error("error"); }
                    );

                    //$scope.tasklistInsumos.push(
                    //    {
                    //        "nameFile": result.nameFile,
                    //        "fullpath": result.fullPathFile
                    //    });
                }
            });
            debugger;
        }

    }
})();