(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("formacionacademicaAddCtrl", ['$rootScope', 'AuthService', '$scope', 'FormacionAcademicaService', 'globalGet', 'FileUploader', '$state', '$filter', 'uploadFileACH', '$uibModal', formacionacademicaAddCtrl]);
    function formacionacademicaAddCtrl($rootScope, AuthService, $scope, FormacionAcademicaService, globalGet, FileUploader, $state, $filter, uploadFileACH, $uibModal) {
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        window.scrollTo(0, 0)
        var API = globalGet.get("api");
        $scope.content = "si";
        $scope.requiredatalisttestinputinstitucion = true;
        //get usuario
        //Extraer informacion del usuario//
        $scope.authentication = AuthService.authentication;

        //Gestion de ficha
        $scope.idGF = $rootScope.GestionFichasClave;
        $scope.nomGF = $rootScope.GestionFichasNombre;
        $scope.registro = { nombrePersona: '' };
        if ($scope.idGF == null) {
            $scope.clavePersona = AuthService.authentication.userprofile.clavePersona;
            $scope.nombreEmpleado = AuthService.authentication.nombreCompleto;
            $scope.registro.nombrePersona = $scope.nombreEmpleado;
        } else {
            $scope.clavePersona = $scope.idGF;
            $scope.nombreEmpleado = $scope.nomGF;
            $scope.registro.nombrePersona = $scope.nombreEmpleado;
        }



        $scope.regresar=function(){
            $state.go("fichapersonal.fa", { seccion: 'formacionacademica' });
        }

        $scope.registrofa = {};
        $scope.registrofa.cedu = false;
        $scope.registrofa.estaTitulado = "";
        $scope.registrofa.estaTitulado = true;
        //Get Titulos (grade)
        FormacionAcademicaService.getGradoAcademico().then(
            function (result) {
                $scope.gradosacademicos = result.data;

            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de grado academico.");
            }
        );

        //obtener lista de carreras
        FormacionAcademicaService.getCarrera().then(
            function (result) {
                $scope.carreras = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de carreras.");
            }
        );

        //obtener instituciones 
        FormacionAcademicaService.getInstituciones().then(
            function (result) {
                $scope.instituciones = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de instituciones.");
            }
        );
        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {
            if (adjunto.files.length <= 0) { return false; }
            $scope.files = [];
            $scope.files.push(adjunto.files[0]);
            
            // $scope.uploadFiles();
            var propiedades = {
                file: adjunto.files[0],
                ext: "pdf;doc;docx;jpeg;jpg", /* pdf;doc;docx;ppt */
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
                        angular.element("input[type='file']").val(null);
                        $(":file").filestyle('clear');
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
                    $scope.registrofa.Adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CH"
                    }
                    $scope.fromfa.$setDirty();
                }
            });
            
        }
        //#endregion info gral


        //modal carreras
        $scope.opencarreras = function () {
            $scope.desabilitar = true;
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/listacarreras.html',
                controller: function ($scope, $uibModalInstance) {
                    $scope.carrera = {};
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    }

                    $scope.ok = function (item) {
                        $uibModalInstance.close(item);
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selectedcarrera = selectedItem;
                $scope.selectedcarrera.carreraId = selectedItem.carreraId;
                $scope.fromfa.$setDirty();
            });
            $scope.desabilitar = false;
        }

        //modal instituciones
        $scope.openInstituciones = function () {
            $scope.desabilitar = true;
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/listainstituciones.html',
                controller: function ($scope, $uibModalInstance) {
                    $scope.institucion = {};
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    }

                    $scope.ok = function (item) {
                        $uibModalInstance.close(item);
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selectedinstitucion = selectedItem;
                $scope.selectedinstitucion.institucionID = selectedItem.institucionID;
                $scope.fromfa.$setDirty();
            });
            $scope.desabilitar = false;
        }


        //AGRERGAR REGISTRO

        $scope.addFormacion = function () {
            if ($scope.fromfa.$invalid || typeof $scope.registrofa.gradoAcademicoId === 'Undefined') {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                if ($scope.registrofa.cedu == false) {
                    $scope.registrofa.cedula = null;
                }
                
                if ($scope.registrofa.cedu == true && ($scope.registrofa.cedula == "" || $scope.registrofa.cedula == null || $scope.registrofa.cedula == undefined)) {
                    toastr.error("Complete los datos requeridos");
                    return false;
                }
                //Validacion Fechas
                $scope.hoy = new Date();
                $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');
                if ($scope.registrofa.fechaInicio > $scope.hoy) {
                    toastr.error("La fecha de inicio debe estar comprendida hasta " + $scope.hoyString);
                    return false;
                }
                if ($scope.registrofa.fechaTermino > $scope.hoy) {
                    toastr.error("La fecha de término debe estar comprendida hasta " + $scope.hoyString);
                    return false;
                }
                if ($scope.registrofa.fechaInicio >= $scope.registrofa.fechaTermino) {
                    toastr.error("La fecha de inicio debe ser menor a la de término");
                    return false;
                }
                /////////////////

                // obtener id de la carrera
                $scope.registrofa.carreraId = $scope.selectedcarrera.carreraId;

                // obetener id de la institucion
                $scope.registrofa.institucionID = $scope.selectedinstitucion.institucionID;

                //otener el id del paises
                $scope.registrofa.paisID = $scope.selectedinstitucion.paisID;

                // ingresar el numero de empleado 
                $scope.registrofa.claveEmpleado = $scope.claveEmpleado;

                //por default cuando se agrega un registro el estdo del flujo es 1
                $scope.registrofa.estadoFlujoId = 1;

                ////ingresar id del archivo, esta pendiente por validar 
                //$scope.registrofa.idArchivo = $scope.numEmp

                // Guardar registro FA
                $scope.desabilitar = true;
                ///Enlazar con Persona 
                $scope.registrofa.clavePersona = $scope.clavePersona;
                //$scope.registrofa.ruPersona = AuthService.authentication.userprofile.ruPersona;
                //$scope.registrofa.fechaEfectiva = AuthService.authentication.userprofile.fechaEfectiva;
                var registro={
                    "ClavePersona": $scope.clavePersona,
                    "GradoAcademicoId": $scope.registrofa.gradoAcademicoId,
                    "FechaInicio": $scope.registrofa.fechaInicio,
                    "FechaTermino": $scope.registrofa.fechaTermino,
                };

                FormacionAcademicaService.ValidaRegistroDuplicado(registro).then(
                    function(res){
                        if(res.data){
                            toastr.warning("Intente cambiar grado académico o las fechas de inicio y término");
                            toastr.warning("Ya existe el registro!");
                            
                            return false;
                        }
                        FormacionAcademicaService.addFormacion($scope.registrofa).then(
                            function (result) {
                                toastr.success(result.data);
                                $state.go("fichapersonal.fa", { seccion: 'formacionacademica' });
                            },
                            function (err) {
                                console.error(err);
                                $scope.desabilitar = false;
                            });
                    },function(err){
                        console.log(err);
                    }
                );
                
            }
        }
    }

})();