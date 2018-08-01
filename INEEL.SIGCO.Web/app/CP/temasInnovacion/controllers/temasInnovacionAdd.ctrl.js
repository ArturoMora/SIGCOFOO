﻿(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("TemasInnovacionAddCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "$filter",
        "$rootScope",
        "TemasInnovacionCPService",
        "$uibModal",
        "DTOptionsBuilder",
        "globalGet",
        "uploadFileACH",
        TemasInnovacionAddCtrl
        ]);

    function TemasInnovacionAddCtrl(AuthService, $scope, $state,$stateParams, $filter,$rootScope, TemasInnovacionCPService, $uibModal, DTOptionsBuilder, globalGet, uploadFileACH) {
        var API = globalGet.get("api");
        $scope.idComunidad = $stateParams.id;
        $scope.authentication = AuthService.authentication;
        $scope.datePicker = getRangoDeFechaDefault(0, 0, 10);
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);
        
        $scope.temas = {};
        $scope.autores = [];
        $scope.acceso = [
        {
            'atributo': "Público",
            'valor': true
        },
        {
            'atributo': "Restringido",
            'valor': false
        }
        ];
        
        //Abre modal de investigadores
        $scope.openUser = function () {
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/PersonasFilterGet.html',
                controller: 'PersonasFilterGetCtrl',
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                for (var c = 0; c < $scope.autores.length; c++) {
                    if ($scope.autores[c].clavePersona == selectedItem.clavePersona) {
                        toastr.error("El autor ya se encuentra agregado");
                        return false;
                    }
                }
                var autores = {
                    'clavePersona': selectedItem.clavePersona,
                    'nombreCompleto': selectedItem.nombreCompleto
                };
                $scope.autores.push(autores);
                $scope.ValidForm.$setDirty();
                //$scope.temas.autores.push(selectedItem.clavePersona);


            });
        }

        $scope.deleteUser=function(index) {
            $scope.autores.splice(index, 1);
           // $scope.temas.autores.splice(index);
        }

        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {
            if (adjunto.files.length <= 0) { return false; }
          //  $scope.files.push(adjunto.files[0]);
            var propiedades = {
                file: adjunto.files[0],
                ext: "pdf;doc;docx;ppt;pptx", /* pdf;doc;docx;ppt */
                type: '*', /* */
                size: '8', /* cantidad entera en MB*/
                api: API + "FileUploadMT/UploadFiles/"
            }
            uploadFileACH.upload(propiedades,
            function (err, result) {
                
                if (!err) {
                    if (!result.error) {
                        $scope.ValidForm.$setDirty();
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
                    //agregarlo al modelo
                    $scope.temas.Adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CP"
                    }
                }
            });
        }

        //$scope.deleteFile = function () {
        //    $scope.temas.adjunto.nombre = "eliminar";
        //    TemasInnovacionCPService.update($scope.temas).then(
        //        function (result) {
        //            toastr.success(result.data);
        //            angular.element("input[type='file']").val(null);
        //            $(":file").filestyle('clear');
        //        }, function (error) {
        //            toastr.error(error.data);
        //            console.log(error.data);
        //        });
        //}

        $scope.AddRegistro = function () {
            if ($scope.ValidForm.$invalid) {
                return false;
            } else {
                $scope.temas.claveAutores = [];
                for (var c = 0; c < $scope.autores.length; c++) {
                    $scope.temas.claveAutores.push($scope.autores[c].clavePersona);
                }

                $scope.temas.personaAutoriza = $scope.authentication.nombreCompleto;
                $scope.temas.fechaRegistro = ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString();
                $scope.temas.idCP = $scope.idComunidad;

                TemasInnovacionCPService.create($scope.temas).then(function (result) {
                    toastr.success(result.data);
                    $scope.ValidForm.$setPristine();
                    $scope.regresar();
                }, function (error) {
                    toastr.error(error.data.message);
                    console.log(error);
                });
            }
             
            
        }

        $scope.regresar = function () {
            $rootScope.globalRegresar();
        }

    }
})();