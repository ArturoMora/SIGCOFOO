(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("InformeAnualEditCtrl", [
        "$scope",
        "$state",
        "$rootScope",
        "$stateParams",
        "InformesAnualesCPService",
        "AutoresCPService",
        "AuthService",
        "globalGet",
        "DTOptionsBuilder",
        "uploadFileACH",
        "$uibModal",
        InformeAnualEditCtrl
        ]);

    function InformeAnualEditCtrl($scope, $state,$rootScope, $stateParams, InformesAnualesCPService, AutoresCPService, AuthService, globalGet, DTOptionsBuilder, uploadFileACH, $uibModal) {
        var API = globalGet.get("api");
        $scope.authentication = AuthService.authentication;
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);
        $scope.datePicker = getRangoDeFechaDefault(0, 0, 10);
        $scope.autoresNuevos = [];
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
        
        InformesAnualesCPService.getById($stateParams.id).then(
            function (result) {
                $scope.informes = result.data;
                $scope.informes.fechaRegistro = new Date($scope.informes.fechaRegistro);
                $scope.informes.nombre = $scope.informes.nombreInforme;
                $scope.informes.anioCorrespondiente = $scope.informes.anios;
                $scope.lineaDesarrolloTecnologicoId = $scope.informes.lineaDesarrolloTecnologico.lineaDesarrolloTecnologicoId;
                if ($scope.informes.adjuntoId == null) {
                    $scope.regFile = true;
                } else {
                    $scope.regFile = false;
                    
                }
            },
            function (err) {
                console.error(err);
            });
        
        InformesAnualesCPService.getLineasDesarrolloTecnologico().then(
                function (response) {
                    $scope.lineas = response.data;
                }
                , function (error) {
                    toastr.warning(error.data.message);
                }
            );

        //Obtiene los registros de autores
        var busqueda = { 'idOC': 4, 'ContenidoId': $stateParams.id };
        AutoresCPService.getByContenido(busqueda).then(
            function (result) {
            $scope.autores = result.data;
            }, function (error) {
            toastr.error("No se han podido cargar los registros de autores");
           // console.log(error);
        });

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
                //$scope.informes.autores.push(selectedItem.clavePersona);


            });
        }


        $scope.deleteUser = function (objeto) {
            $scope.autores.splice($scope.autores.indexOf(objeto), 1);
            $scope.ValidForm.$setDirty();
            //var autor = {
            //    "ContenidoId": $stateParams.id,
            //    "clave": objeto.clavePersona
            //};
            //AutoresCPService.deleteUserByContenido(autor)//Elimina por OC
            //    .then(function(result) {
            //        toastr.success(result.data);
            //        $scope.autores.splice($scope.autores.indexOf(objeto), 1);
            //        },function(error) {
            //            toastr.error(error.data);
            //            console.log(error.data);
            //        }
            //    );
            
        }

        //$scope.deleteUserNuevo = function (objeto) {
        //    $scope.autoresNuevos.splice($scope.autoresNuevos.indexOf(objeto), 1);
        //}

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
                //debugger;
                if (!err) {
                    console.log("result:");
                    console.log(result);
                    //  debugger;
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
            console.log(result);
            $scope.$apply(function () {
                if (result.error === false) {
                    //agregarlo al modelo
                    $scope.ValidForm.$setDirty();
                    $scope.informes.Adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CP"
                    }
                }
            });
        }

        $scope.deleteFile = function () {
            $scope.informes.adjunto = null;
            angular.element("input[type='file']").val(null);
            $(":file").filestyle('clear');
            $scope.regFile = true;
            $scope.ValidForm.$setDirty();
            //$scope.informes.adjunto.nombre = "eliminar";
            //InformesAnualesCPService.update($scope.informes).then(
            //    function(result) {
            //        toastr.success(result.data);
            //        $scope.informes.adjunto.adjuntoId = 0;
            //        $scope.informes.adjunto = null;
            //        angular.element("input[type='file']").val(null);
            //        $(":file").filestyle('clear');
            //        $scope.regFile = true;
            //    },function(error) {
            //        toastr.error(error.data);
            //        console.log(error.data);
            //    });
        }

        $scope.EditRegistro = function () {
            if ($scope.ValidForm.$invalid) {
                return false;
            } else {
                $scope.informes.idLineaInv = $scope.lineaDesarrolloTecnologicoId;
                $scope.informes.claveAutores = [];
                for (var c = 0; c < $scope.autores.length; c++) {
                    $scope.informes.claveAutores.push($scope.autores[c].clavePersona);
                }
                InformesAnualesCPService.update($scope.informes).then(
                    function (result) {
                        toastr.success(result.data);
                        $scope.ValidForm.$setPristine();
                        $scope.regresar();

                    }, function (error) {
                        toastr.error(error.data);
                        //console.log(error.data);
                    });
            }
            
        }


        $scope.regresar = function () {
            $rootScope.globalRegresar();
        }

       
    }
})();