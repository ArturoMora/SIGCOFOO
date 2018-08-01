(function () {
    "use strict";
    angular
        .module("ineelCH")
        .controller("BecarioExternoAddCtrl", ['$rootScope', 'AuthService', '$scope', 'BecarioExternoServiceCH', 'globalGet',
            'FileUploader', '$state', '$filter', '$uibModal', 'uploadFileACH', 'DTOptionsBuilder', BecarioExternoAddCtrl]);

    function BecarioExternoAddCtrl($rootScope, AuthService, $scope, BecarioExternoServiceCH, globalGet,
        FileUploader, $state, $filter, $uibModal, uploadFileACH, DTOptionsBuilder) {
        var API = globalGet.get("api");
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        window.scrollTo(0, 0);
        $scope.globalGet;
        $scope.content = "si";
        $scope.requiredatalisttestinputinstitucion = true;
        $scope.registroBecario = {};
        $scope.registroBecario.adjuntoBecarioExterno = [];
        $scope.authentication = AuthService.authentication;
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);
        //Gestion de ficha
        $scope.idGF = $rootScope.GestionFichasClave;
        $scope.nomGF = $rootScope.GestionFichasNombre;
        $scope.registro = { nombrePersona: '' };
        if ($scope.idGF == null) {
            $scope.claveBecario = AuthService.authentication.userprofile.clavePersona;
            $scope.nombreBecario = AuthService.authentication.nombreCompleto;
            $scope.registro.nombrePersona = $scope.nombreBecario;
        } else {
            $scope.claveBecario = $scope.idGF;
            $scope.nombreBecario = $scope.nomGF;            
        }
        $scope.registro.nombrePersona = $scope.nombreBecario;
        $scope.registro.clavePersona = $scope.claveBecario;



        //obtener instituciones 
        BecarioExternoServiceCH.getInstituciones().then(
            function (result) {
                $scope.instituciones = result.data;
            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de instituciones.");
            }
        );

        //Get TipoBeca
        BecarioExternoServiceCH.getTipoBeca().then(
            function (result) {
                $scope.becas = result.data;

            },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de tipo de beca.");
            }
        );

        ///Validar rango de fechas
        $scope.validarFechasInicio = function () {
            $scope.fechaActual = new Date();
            $scope.inicioDateComparacion = new Date($scope.registroBecario.fechaInicio);
            $scope.finalDateComparacion = new Date($scope.registroBecario.fechaTermino);
            if ($scope.inicioDateComparacion > $scope.finalDateComparacion) {
                toastr.error("Fecha de inicio deber ser menor a fecha de término.");
                $scope.registroBecario.fechaInicio = "";
                return false;
            }
            if ($scope.inicioDateComparacion > $scope.fechaActual) {
                toastr.error("Fecha inicial deber ser menor a la de hoy");
                $scope.registroBecario.fechaInicio = "";
                return;
            }
        }

        $scope.validarFechas = function () {
            $scope.fechaActual = new Date();
            $scope.inicioDateComparacion = new Date($scope.registroBecario.fechaInicio);
            $scope.finalDateComparacion = new Date($scope.registroBecario.fechaTermino);
            if ($scope.inicioDateComparacion > $scope.finalDateComparacion) {
                toastr.error("Fecha de inicio deber ser menor a fecha de término.");
                $scope.registroBecario.fechaTermino = "";
                return false;
            }
            if ($scope.finalDateComparacion > $scope.fechaActual) {
                toastr.error("Fecha final deber ser menor a la de hoy");
                $scope.registroBecario.fechaTermino = "";
                return;
            }
        }

        //Buscar Persona
        $scope.PersonaSeleccionada = {};
        $scope.verpersona = false;
        $scope.openBecario = function () {
            $scope.desabilitarBuscarBecario = true;
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
                    $scope.asesor = selectedItem.nombreCompleto;
                    $scope.registroBecario.asesor_ClavePersona = selectedItem.clavePersona;
                    $scope.registroBecario.asesor_Nombre = selectedItem.nombreCompleto;
                    $scope.PersonaSeleccionada = selectedItem;
                }
                $scope.fromBecario.$setDirty();
            });
            $scope.desabilitarBuscarBecario = false;
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
                $scope.institucionselect = selectedItem;
                $scope.fromBecario.$setDirty();
            });
            $scope.desabilitar = false;
        }


        //Buscar Proyecto
        $scope.ProyectoSeleccionado = {};
        $scope.verproyecto = false;
        $scope.openProyecto = function () {
            $scope.desabilitarBuscarProyecto = true;
            $scope.proyectoSelect = {};
            var modalInstance = $uibModal.open({
                size: 'lg',
                templateUrl: 'app/vistasGenericas/buscarProyecto.html',
                controller: 'ProyectosFilterSubprogramaCtrl as showCase',
                resolve: {
                    proyectoSelect: function () {
                        $scope.verproyecto = false;
                        return $scope.proyectoSelect;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.proyecto = selectedItem.proyectoId + " - " + selectedItem.nombre;
                $scope.registroBecario.proyectoId = selectedItem.proyectoId;
                $scope.registroBecario.proyecto = selectedItem.nombre;
                $scope.ProyectoSeleccionado = selectedItem;
                $scope.fromBecario.$setDirty();
            });
            $scope.desabilitarBuscarProyecto = false;
        }


        //AGRERGAR REGISTRO
        $scope.addBecario = function () {
            if ($scope.fromBecario.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            }

            // obetener id de la institucion
            $scope.registroBecario.institucionID = $scope.institucionselect.institucionID;

            // obetener tipo de beca
            $scope.registroBecario.tipoBecaId = $scope.selectedTipoBeca;


            // ingresar el numero de becario
            $scope.registroBecario.becario_ClavePersona = $scope.claveBecario;
            $scope.registroBecario.becario_Nombre = $scope.nombreBecario;

            //por default cuando se agrega un registro el estado del flujo es 1
            $scope.registroBecario.estadoFlujoId = 1;
            $scope.registroBecario.estadoActivoId = 1;
            $scope.registroBecario.estadoActivo = "Activo";
            $scope.desabilitar = true;

            
            var registro={
                "Becario_ClavePersona": AuthService.authentication.userprofile.clavePersona,
                "TipoBecaId": $scope.registroBecario.tipoBecaId,
                "FechaInicio": $scope.registroBecario.fechaInicio,
                "FechaTermino": $scope.registroBecario.fechaTermino,
            };

            BecarioExternoServiceCH.ValidaRegistroDuplicado(registro).then(
                function(res){
                    if(res.data){
                        toastr.warning("Intente cambiar el tipo de beca, las fechas de inicio y término o el número de becario");
                        toastr.warning("Ya existe el registro!");
                        
                        return false;
                    }
                    BecarioExternoServiceCH.addBecario($scope.registroBecario).then(
                        function (result) {
                            toastr.success(result.data);
                            $state.go("fichapersonal.becarioexterno", { seccion: 'becarioexterno' });
                        },
                        function (err) {
                            console.error(err);
                            $scope.desabilitar = false;
                            $state.go("fichapersonal.becarioexterno", { seccion: 'becarioexterno' });
                        });
                },function(err){
                    console.log(err);
                }
            );
            

        }



        //--------------------------------------------------- logica de adjunto
        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {
            if (adjunto.files.length <= 0) {
                return false;
            }
            //Que no exita el adjunto
            var igual = 0;
            var contador = 0;
            for (contador = 0; contador < $scope.registroBecario.adjuntoBecarioExterno.length; contador++) {
                if (adjunto.files.length > 0) {
                    if (adjunto.files[0].name == $scope.registroBecario.adjuntoBecarioExterno[contador].adjunto.nombre) {
                        $("#filesGral").filestyle('clear');
                        toastr.error("El adjunto ya existe");
                        return false;
                    }
                }
            }
            $scope.files = [];
            $scope.files.push(adjunto.files[0]);
            // $scope.uploadFiles();
            var propiedades = {
                file: adjunto.files[0],
                ext: "*", /* pdf;doc;docx;ppt */
                type: '*', /* */
                size: '8', /* cantidad entera en MB*/
                api: API + "FileUploadMT/UploadFiles/"
            }
            //pueden utilizar la misma API para los diferentes modulos: API + "FileUploadMT/UploadFiles/"
            uploadFileACH.upload(propiedades,
                function (err, result) {
                    if (!err) {
                        console.log("result:");
                        console.log(result);
                        if (!result.error) {
                            transferComplete(result);
                            $("#filesGral").filestyle('clear');
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
        $scope.tasklist = [];
        $scope.deleteTask = function (index) {
            $scope.tasklist.splice(index, 1);
            angular.element("input[type='file']").val(null);
        }
        // CONFIRMATION.        
        function transferComplete(result) {
            console.log(result);
            $scope.$apply(function () {

                $scope.siguienteIG = false;
                //if (result.error) return; //error al subir archivo
                if (!result.error) {
                    //Que no exita el adjunto
                    var igual = 0;
                    var contador = 0;
                    for (contador = 0; contador < $scope.tasklist.length; contador++) {
                        if (result.nameFile == $scope.tasklist[contador].nameFile) {
                            igual = 1;
                        }
                    }
                    if (igual == 0) {
                        var RegistroFiles = {
                            adjunto: {
                                "rutaCompleta": result.fullPathFile,
                                "nombre": result.nameFile,
                                "moduloId": "CH",
                            }
                        };
                        $scope.registroBecario.adjuntoBecarioExterno.push(RegistroFiles);
                        $scope.fromBecario.$setDirty();
                    }
                    else {
                        $("#filesGral").filestyle('clear');
                        toastr.error("El adjunto ya existe");
                    }
                }
            });
        }
        //#endregion info gral

        $scope.regresar=function(){
            $state.go("fichapersonal.becarioexterno", { seccion: 'becarioexterno' });
        }
        //Eliminar el archivo adjunto
        $scope.OpenDelete = function (rowAdjuntoBecarioExterno) {

            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        var idx = ($scope.registroBecario.adjuntoBecarioExterno.indexOf(rowAdjuntoBecarioExterno));
                        $scope.registroBecario.adjuntoBecarioExterno.splice(idx, 1);
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };

        $scope.clean = function () {
            $scope.proyecto = null;
            $scope.becario.proyectoId = null;
        }

    }

})();