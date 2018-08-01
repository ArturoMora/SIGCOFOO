(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("PlanAnualAddCtrl", [
        "AuthService",
        "$scope",
        "$state",
        "$stateParams",
        "$rootScope",
        "$filter",
        "PlanesAnualesCPService",
        "$uibModal",
        "DTOptionsBuilder",
        "globalGet",
        "uploadFileACH",
        PlanAnualAddCtrl
        ]);

    function PlanAnualAddCtrl(AuthService, $scope, $state, $stateParams,$rootScope, $filter, PlanesAnualesCPService, $uibModal, DTOptionsBuilder, globalGet, uploadFileACH) {
        var API = globalGet.get("api");
        $scope.idComunidad = $stateParams.id;
        $scope.authentication = AuthService.authentication;
        $scope.datePicker = getRangoDeFechaDefault(0, 0, 10);
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);
        
        $scope.planes = {};
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
        
        PlanesAnualesCPService.getLineasDesarrolloTecnologico().then(
                function (response) {
                    $scope.lineas = response.data;
                }
                , function (error) {
                    toastr.warning(error.data.message);
                }
            );

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
                //$scope.planes.autores.push(selectedItem.clavePersona);


            });
        }

        $scope.deleteUser=function(index) {
            $scope.autores.splice(index, 1);
           // $scope.planes.autores.splice(index);
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
                //debugger;
                if (!err) {
                  //  console.log("result:");
                  //  console.log(result);
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
          ///  console.log(result);
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

        //$scope.deleteFile = function () {
        //    $scope.planes.adjunto.nombre = "eliminar";
        //    PlanesAnualesCPService.update($scope.planes).then(
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
                $scope.planes.claveAutores = [];
                for (var c = 0; c < $scope.autores.length; c++) {
                    $scope.planes.claveAutores.push($scope.autores[c].clavePersona);
                }

                $scope.planes.idLineaInv = $scope.lineadeinvestigacion.lineaDesarrolloTecnologicoId;
                //$scope.planes.fechaRegistro = ($filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')).toString();
                $scope.planes.idCP = $scope.idComunidad;

                             
                        
                var limiteInferior = new Date(1975, 1, 1);

                var inicioDateComparacion = new Date($scope.planes.fechaRegistro);

                if (inicioDateComparacion < limiteInferior) {
                    toastr.error("La fecha de inicio ingresada no es una fecha válida.");
                    $scope.planes.fechaRegistro = "";
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
         


                PlanesAnualesCPService.create($scope.planes).then(function (result) {
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