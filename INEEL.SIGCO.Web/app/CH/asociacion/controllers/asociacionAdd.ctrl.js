(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("AsociacionesCtrlAdd", ['$rootScope', 'AuthService', '$scope', 'AsociacionesService', 'globalGet', '$state', '$filter', 'uploadFileACH', '$uibModal', AsociacionesCtrlAdd]);
    function AsociacionesCtrlAdd($rootScope, AuthService, $scope, AsociacionesService, globalGet, $state, $filter, uploadFileACH, $uibModal) {
        window.scrollTo(0, 0)
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        //Variable API
        var API = globalGet.get("api");
        $scope.asociacion = {};
        $scope.authentication = AuthService.authentication;


        //Gestion de ficha
        $scope.idGF = $rootScope.GestionFichasClave;
        $scope.nomGF = $rootScope.GestionFichasNombre;
        
        $scope.registro = { nombreEmpleado:''};
        if ($scope.idGF == null) {
            $scope.clavePersona = AuthService.authentication.userprofile.clavePersona;
            $scope.nombreEmpleado = AuthService.authentication.nombreCompleto;
        } else {
            $scope.clavePersona = $scope.idGF;
            $scope.nombreEmpleado = $scope.nomGF;
        }
        $scope.registro.nombrePersona = $scope.nombreEmpleado;
        $scope.registro.clavePersona = $scope.clavePersona;

        AsociacionesService.getAsociaciones()
            .then(
            function (result) {
                $scope.asociaciones = result.data;
            },
            function (err) {
                console.error(err);
            });
        ///////////////////////////////////////////////////////////////
        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {if (adjunto.files.length <= 0){return false;}
            $scope.files = [];
            $scope.files.push(adjunto.files[0]);
            
            // $scope.uploadFiles();
            var propiedades = {
                file: adjunto.files[0],
                ext: "pdf;doc;docx", /* pdf;doc;docx;ppt */
                type: '*', /* */
                size: '8', /* cantidad entera en MB*/
                api: API + "FileUploadMT/UploadFiles/"
            }
            uploadFileACH.upload(propiedades,
                function (err, result) {
                    
                    if (!err) {
                        console.log("result:");
                        console.log(result);
                        
                        if (!result.error) {
                            transferComplete(result);
                        } else {
                            toastr.error(result.message);
                        }
                    } else {
                        var error = err.message || "Error al adjuntar";
                        $("#filesGral").filestyle('clear');
                        toastr.error(error);
                    }
                    
                });
        };
        function transferComplete(result) {
            
            console.log("aqui");
            console.log(result);
            $scope.$apply(function () {
                if (result.error === false) {
                    //$scope.registrofa.AdjuntoId = result.fullPathFile;
                    //agregarlo al modelo
                    $scope.asociacion.Adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CH"
                    }
                    $scope.AsociacionesForm.$setDirty();
                }
            });
            
        }
        //#endregion info gral
        ///////////////////////////////////////////////////////////////

        //modal asociaciones
        $scope.openAsociaciones = function () {
            $scope.desabilitar = true;
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/listaasociaciones.html',
                controller: function ($scope, $uibModalInstance) {
                    $scope.asociacion = {};
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    }

                    $scope.ok = function (item) {
                        $scope.asociacion = item;
                        $uibModalInstance.close($scope.asociacion);
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.asociacionselect = selectedItem;
                $scope.asociacion.asociacionId = selectedItem.asociacionId;
                $scope.AsociacionesForm.$setDirty();
            });
            $scope.desabilitar = false;
        }

        $scope.regresar=function(){
            $state.go("fichapersonal.asociacion", { seccion: 'asociacion' });
        }

        //Agregar
        $scope.save = function () {
            if ($scope.AsociacionesForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            }
            //Validacion Fechas
            $scope.hoy = new Date();
            $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');
            if ($scope.asociacion.fechaInicio > $scope.hoy) {
                toastr.error("La fecha de inicio debe estar comprendida hasta " + $scope.hoyString);
                return false;
            }
            //if ($scope.asociacion.fechaTermino > $scope.hoy) {
            //    toastr.error("La fecha de término debe estar comprendida hasta " + $scope.hoyString);
            //    return false;
            //}
            if ($scope.asociacion.fechaInicio >= $scope.asociacion.fechaTermino) {
                toastr.error("La fecha de inicio debe ser menor a la de término");
                return false;
            }
            /////////////////
            $scope.asociacion.estadoFlujoId = 1;
            $scope.desactivar = true;
            $scope.asociacion.clavePersona = $scope.clavePersona;

            var registro={
                "ClavePersona": $scope.clavePersona,
                "AsociacionId": $scope.asociacion.asociacionId,
                "FechaInicio": $scope.asociacion.fechaInicio,
                "FechaTermino": $scope.asociacion.fechaTermino
            };

            AsociacionesService.ValidaRegistroDuplicado(registro).then(
                function(res){
                    if(res.data){
                        toastr.warning("Intente cambiar la asociación asociada o las fechas de inicio y término");
                        toastr.warning("Ya existe el registro!");
                                
                        return false;
                    }
                    AsociacionesService.Add($scope.asociacion).then(
                        function (result) {
                            toastr.success(result.data);
                            $state.go("fichapersonal.asociacion", { seccion: 'asociacion' });
                        },
                        function (err) {
                            $scope.desactivar = false;
                            console.error(err);
                        });
                },function(err){
                    console.log(err);
                }
            );

            
        }
    }
})();