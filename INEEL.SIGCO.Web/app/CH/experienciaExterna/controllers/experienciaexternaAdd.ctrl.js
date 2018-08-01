(function () {
    "use strict";

    angular
        .module("ineelCH")
        .directive('numbersOnly', function () {
            return {
                require: 'ngModel',
                link: function (scope, element, attr, ngModelCtrl) {
                    function fromUser(text) {
                        if (text) {
                            var transformedInput = text.replace(/[^0-9]/g, '');

                            if (transformedInput !== text) {
                                ngModelCtrl.$setViewValue(transformedInput);
                                ngModelCtrl.$render();
                            }
                            return transformedInput;
                        }
                        return undefined;
                    }
                    ngModelCtrl.$parsers.push(fromUser);
                }
            };
        })
        .controller("experienciaexternaCtrlAdd"
            , ['$rootScope','AuthService'
            , '$scope'
            , 'ExperienciaExternaService'
            , 'globalGet'
            , 'uploadFileACH'
            , '$state'
            , '$filter'
            , '$uibModal'
            , experienciaexternaCtrlAdd]);
    function experienciaexternaCtrlAdd($rootScope,AuthService, $scope, ExperienciaExternaService, globalGet, uploadFileACH, $state, $filter, $uibModal) {
        //Variable API
        window.scrollTo(0, 0);
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;


        $scope.registro = {};
        //Gestion de ficha
        $scope.idGF = $rootScope.GestionFichasClave;
        $scope.nomGF = $rootScope.GestionFichasNombre;
        if ($scope.idGF == null) {
            $scope.registro.clavePersona = AuthService.authentication.userprofile.clavePersona;
            $scope.registro.nombrePersona = AuthService.authentication.nombreCompleto;
        } else {
            $scope.registro.clavePersona = $scope.idGF;
            $scope.registro.nombrePersona = $scope.nomGF;
        }

        $scope.regresar=function(){
            $state.go("fichapersonal.experienciaexterna", { seccion: 'experienciaexterna' });
        }

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
                    $scope.registro.Adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CH"
                    }
                    $scope.ValidForm.$setDirty();
                    
                }
            });
            
        }
        //#endregion info gral
        ///////////////////////////////////////////////////////////////
        //Funcion para agregar registro
        $scope.add = function () {
            if ($scope.ValidForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                //Validacion Fechas
                $scope.hoy = new Date();
                $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');
                if ($scope.registro.fechaInicio > $scope.hoy) {
                    toastr.error("La fecha de inicio debe estar comprendida hasta " + $scope.hoyString);
                    return false;
                }
                if ($scope.registro.fechaTermino > $scope.hoy) {
                    toastr.error("La fecha de término debe estar comprendida hasta " + $scope.hoyString);
                    return false;
                }
                if ($scope.registro.fechaInicio >= $scope.registro.fechaTermino) {
                    toastr.error("La fecha de inicio debe ser menor a la de término");
                    return false;
                }
                /////////////////
                $scope.desactivar = true;
                $scope.registro.estadoFlujoId = 1;
                ExperienciaExternaService.add($scope.registro).then(
                    function (result) {
                        toastr.success(result.data);
                        $state.go("fichapersonal.experienciaexterna", { seccion: 'experienciaexterna' });
                    },
                    function (err) {
                        $scope.desactivar = false;
                        console.error(err);
                    });
            }
        }
    }
})();