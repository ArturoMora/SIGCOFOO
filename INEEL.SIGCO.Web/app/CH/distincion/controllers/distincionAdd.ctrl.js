(function () {
    "use strict";

    angular
        .module("ineelCH")
        .controller("distincionAddCtrl"
        , ['$rootScope','AuthService'
            , '$scope'
            , 'DistincionService'
            , 'globalGet'
            , 'FileUploader'
            , '$state'
            , '$filter'
            , 'uploadFileACH'
            , distincionAddCtrl]);

    function distincionAddCtrl($rootScope,AuthService, $scope, DistincionService, globalGet, FileUploader, $state, $filter, uploadFileACH) {
        //Variable API
        window.scrollTo(0, 0)
        $(document).ready(function () {
            //$("form").keypress(function (e) {
            //    if (e.which == 13) {
            //        return false;
            //    }
            //});
        });
        var API = globalGet.get("api");
        $scope.distincion = {};
        //Extraer informacion del usuario//
        $scope.authentication = AuthService.authentication;
        //Gestion de ficha
        $scope.idGF = $rootScope.GestionFichasClave;
        $scope.nomGF = $rootScope.GestionFichasNombre;
        $scope.registro = { nombreEmpleado: '' };
        if ($scope.idGF == null) {
            $scope.clavePersona = AuthService.authentication.userprofile.clavePersona;
            $scope.nombreEmpleado = AuthService.authentication.nombreCompleto;
        } else {
            $scope.clavePersona = $scope.idGF;
            $scope.nombreEmpleado = $scope.nomGF;
        }
        $scope.registro.nombrePersona = $scope.nombreEmpleado;
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
            $scope.$apply(function () {
                if (result.error === false) {
                    //$scope.registrofa.AdjuntoId = result.fullPathFile;
                    //agregarlo al modelo
                    $scope.distincion.Adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CH"
                    }
                    $scope.distincionform.$setDirty();
                    
                }
            });
            
        }

        $scope.regresar=function(){
            $state.go("fichapersonal.distincion", { seccion: 'distincion' });
        }
        //#endregion info gral
        ///////////////////////////////////////////////////////////////


        //Agregar distincion
        $scope.distincionadd = function () {
            if ($scope.distincionform.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                $scope.fechaActual = new Date();
                if ($scope.distincion.fechaDistincion > $scope.fechaActual) {
                    var date = new Date();
                    $scope.ddMMyyyy = $filter('date')(new Date(), 'dd/MM/yyyy');
                    toastr.error("La fecha de obtención de distinción debe ser menor a " + $scope.ddMMyyyy);
                } else {
                    $scope.desabilitar = true;
                    $scope.distincion.EstadoFlujoId = "1";
                    $scope.distincion.clavePersona = $scope.clavePersona;
                    $scope.distincion.ruPersona = AuthService.authentication.userprofile.ruPersona;
                    $scope.distincion.fechaEfectiva = AuthService.authentication.userprofile.fechaEfectiva; 
                    var registro={
                        "ClavePersona": $scope.clavePersona,
                        "FechaDistincion": $scope.distincion.fechaDistincion,
                    };

                    DistincionService.ValidaRegistroDuplicado(registro).then(
                        function(res){
                            if(res.data){
                                toastr.warning("Intente cambiar las fechas de distinción");
                                toastr.warning("Ya existe el registro!");
                                
                                return false;
                            }
                            DistincionService.distincionadd($scope.distincion).then(
                                function (result) {
                                    toastr.success(result.data);
                                    $state.go("fichapersonal.distincion", { seccion: 'distincion' });
                                },
                                function (err) {
                                    $scope.desabilitar = false;
                                    console.error(err);
                                });
                        },function(err){
                            console.log(err);
                        }
                    );
                    
                }
            }
        }
    }
})();