(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("PlanAnualEditCtrl", [
        "$scope",
        "$state",
        "$rootScope",
        "$stateParams",
        "PlanesAnualesCPService",
        "AutoresCPService",
        "AuthService",
        "globalGet",
        "DTOptionsBuilder",
        "uploadFileACH",
        "$uibModal",
        PlanAnualEditCtrl
        ]);

    function PlanAnualEditCtrl($scope, $state, $rootScope,$stateParams, PlanesAnualesCPService, AutoresCPService, AuthService, globalGet, DTOptionsBuilder, uploadFileACH, $uibModal) {
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
        
        PlanesAnualesCPService.getById($stateParams.id).then(
            function (result) {
                $scope.planes = result.data;
                $scope.planes.fechaRegistro = new Date($scope.planes.fechaRegistro);
                $scope.lineaDesarrolloTecnologicoId = $scope.planes.lineaDesarrolloTecnologico.lineaDesarrolloTecnologicoId;
                $scope.planes.nombre = $scope.planes.nombrePlan;
                $scope.planes.anioCorrespondiente = $scope.planes.anios;
                if ($scope.planes.adjuntoId == null) {
                    $scope.regFile = true;
                } else {
                    $scope.regFile = false;
                    
                }
            },
            function (err) {
                console.error(err);
            });
        
        PlanesAnualesCPService.getLineasDesarrolloTecnologico().then(
                function (response) {
                    $scope.lineas = response.data;
                }
                , function (error) {
                    toastr.warning(error.data.message);
                }
            );

        //Obtiene los registros de autores
        var busqueda = { 'idOC': 5, 'ContenidoId': $stateParams.id };
        AutoresCPService.getByContenido(busqueda).then(
            function (result) {
            $scope.autores = result.data;
            }, function (error) {
            toastr.error("No se han podido cargar los registros de autores");
            //console.log(error);
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
                //$scope.planes.autores.push(selectedItem.clavePersona);


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
                    //console.log("result:");
                    //console.log(result);
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
           // console.log(result);
            $scope.ValidForm.$setDirty();
            $scope.$apply(function () {
                if (result.error === false) {
                    //agregarlo al modelo
                    $scope.planes.Adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CP"
                    }
                }
            });
        }

        $scope.deleteFile = function () {
            $scope.planes.adjunto = null;
            angular.element("input[type='file']").val(null);
            $(":file").filestyle('clear');
            $scope.regFile = true;
            $scope.ValidForm.$setDirty();
            //$scope.planes.adjunto.nombre = "eliminar";
            //PlanesAnualesCPService.update($scope.planes).then(
            //    function(result) {
            //        toastr.success(result.data);
            //        $scope.planes.adjunto.adjuntoId = 0;
            //        $scope.planes.adjunto = null;
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
                $scope.planes.idLineaInv = $scope.lineaDesarrolloTecnologicoId;
                $scope.planes.claveAutores = [];
                for (var c = 0; c < $scope.autores.length; c++) {
                    $scope.planes.claveAutores.push($scope.autores[c].clavePersona);
                }





                var limiteInferior = new Date(1975, 1, 1);

                var inicioDateComparacion = new Date($scope.planes.fechaRegistro);

                if (inicioDateComparacion < limiteInferior) {
                    toastr.error("La fecha de inicio ingresada no es una fecha válida.");
                 
                    return false;
                }



                var year = parseInt($scope.planes.anioCorrespondiente);

                if (year != undefined || year != null) {

                    if (year < 1975) {

                        toastr.error("Ingrese un año válido.");
                        $scope.planes.anioCorrespondiente = "";
                        return false;
                    }
                }



                PlanesAnualesCPService.update($scope.planes).then(
                    function (result) {
                        toastr.success(result.data);
                        $scope.ValidForm.$setPristine();
                        $scope.regresar();

                    }, function (error) {
                        toastr.error(error.data);
                       // console.log(error.data);
                    });
            }
           
        }
                   
        $scope.regresar = function () {
            $rootScope.globalRegresar();
        }

    }
})();