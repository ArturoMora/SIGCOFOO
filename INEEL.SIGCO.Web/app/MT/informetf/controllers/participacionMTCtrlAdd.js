(function () {
    "use strict";

    angular
        .module("ineelMT")
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
        .controller("participacionMTCtrlAdd"
            , ['$rootScope', 'AuthService'
            , '$scope'
            , 'comunService'
            , 'globalGet'
            , 'uploadFileACH'
            , '$state'
            , '$filter'
            , '$uibModal'
            , participacionMTCtrlAdd]);
    function participacionMTCtrlAdd($rootScope, AuthService, $scope, comunService, globalGet, uploadFileACH, $state, $filter, $uibModal) {
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
                //Variable API
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
        if ($rootScope.proyectoRoot == undefined) {
            $rootScope.globalRegresar();
        }

        $scope.proy = $rootScope.proyectoRoot;
        $scope.registro.proyectoId = $scope.proy.proyectoId;
        $scope.registro.proyectoNombre = $scope.proy.nombre;

        $scope.registro.clavePersona = "";
        $scope.registro.nombrePersona = "";

        /////////////////////////Buscar Proyecto
        //Buscar Proyecto
        //$scope.ProyectoSeleccionado = {};
        $scope.verproyecto = false;
        
        ///////////////////////////////////////////////////////////////
        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {if (adjunto.files.length <= 0){return false;}
            $scope.files = [];
            $scope.files.push(adjunto.files[0]);
           
            // $scope.uploadFiles();
            var propiedades = {
                file: adjunto.files[0],
                ext: "pdf;doc;docx;", /* pdf;doc;docx;ppt */
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
                    toastr.error(error);
                }
                debugger;
            });
        };
        function transferComplete(result) {
            
            console.log("aqui");
            console.log(result);
            $scope.$apply(function () {
                if (result.error === false) {
                    //$scope.registrofa.AdjuntoId = result.fullPathFile;
                    //agregarlo al modelo
                    $scope.registro.Adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CH"
                    }
                }
            });
            
        }
        $scope.openParticipante = function () {
            $scope.empleado = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/PersonasFilterGet.html',
                controller: 'PersonasFilterGetCtrl',
                resolve: {
                    empleado: function () {
                        
                        return $scope.empleado;
                    }
                },
                scope: $scope,
            });
            modalInstance.result.then(function (selectedItem) {
                toastr.clear();
                comunService.PersonalProyecto_GetByClave(selectedItem.clavePersona, $scope.registro.proyectoId ).then(
                    function (result) {
                        console.log(result.data);
                        if (result.data != null && result.data.length > 0) {
                            console.log(result.data.length);
                            toastr.warning("Ya se encuentra como participante del proyecto", selectedItem.nombreCompleto);

                        } else {
                            $scope.empleado = selectedItem;
                            $scope.registro.clavePersona = selectedItem.clavePersona;
                            $scope.registro.nombrePersona = selectedItem.nombreCompleto;
                        }
                    },
                    function (err) {
                        toastr.error(err);
                        console.error(err);
                        return;
                    });


            });
        }

        $scope.validarFechaInicio = function () {
          
            $scope.minimo = new Date("1975/11/25");
            if ($scope.registro.fechaInicio < $scope.minimo) {
                toastr.error("Fecha de inicio deber ser mayor a 25/11/1975");
                $scope.registro.fechaInicio = "";
                return false;
            };

        }


        $scope.validarFechaTermino = function () {

            $scope.minimo = new Date("1975/11/25");
            if ($scope.registro.fechaTermino < $scope.minimo) {
                toastr.error("Fecha de termino deber ser mayor a 25/11/1975");
                $scope.registro.fechaTermino = "";
                return false;
            };

        }



        //#endregion info gral
        ///////////////////////////////////////////////////////////////
        //Funcion para agregar registro
        $scope.add = function () {
            if ($scope.ValidForm.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
               
                if ($scope.registro.fechaInicio < $scope.registro.fechaTermino || ($scope.registro.fechaTermino == null && $scope.registro.fechaInicio != null)) {
                    $scope.desactivar = true;
                    $scope.registro.estadoFlujoId = 3;

                    comunService.addPersonalProyectoReturn($scope.registro).then(
                        function (result) {
                            toastr.success("Personal agregado");
                            $rootScope.globalRegresar();
                        },
                        function (err) {
                            $scope.desactivar = false;
                            console.error(err);
                        });
                } else {
                    toastr.error("La fecha de inicio debe ser menor a la de termino");
                }
            }
        }
    }
})();