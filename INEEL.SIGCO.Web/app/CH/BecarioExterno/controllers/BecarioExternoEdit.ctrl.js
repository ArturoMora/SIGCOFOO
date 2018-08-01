(function () {
    "use strict";

    angular.module("ineelCH")
        .controller("BecarioExternoEditCtrl", ['$scope', '$rootScope', 'BecarioExternoServiceCH', 'globalGet', '$state', '$uibModal', 'uploadFileACH', 'DTOptionsBuilder', BecarioExternoEditCtrl]);
    function BecarioExternoEditCtrl($scope, $rootScope, BecarioExternoServiceCH, globalGet, $state, $uibModal, uploadFileACH, DTOptionsBuilder) {
        //Variable API
        var API = globalGet.get("api");
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        window.scrollTo(0, 0)
        $scope.editarGestion = 0;
        $scope.idGF = $rootScope.GestionFichasClave;
        $scope.nomGF = $rootScope.GestionFichasNombre;
        $scope.adjuntosEliminados = [];
        
        if ($scope.idGF != null) {
            $scope.editarGestion = 1;
        }

        $scope.urlDescarga = API + "Descarga/GetFile";
        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);

        var id = $rootScope.getGlobalID();
        $scope.auxid = id;

        $scope.registro = {};
        //obtener informacion becario externo
        
        $scope.obtieneinformacionbe = function () {
            BecarioExternoServiceCH.getById(id).then(
                function (result) {
                    $scope.becario = result.data;
                    if ($scope.becario.asesor_ClavePersona == "00000") {
                        $scope.becario.asesor_Nombre = "Dato no disponible";
                    }
                   
                    $scope.proyecto = $scope.becario.proyecto !== null ? $scope.becario.proyecto.nombre : '';
                    //if ($scope.becario.fechaInicio!=null)
                    //    $scope.becario.fechaInicio = new Date($scope.becario.fechaInicio);
                    //if ($scope.becario.fechaTermino!=null)
                    //    $scope.becario.fechaTermino = new Date($scope.becario.fechaTermino);

                    if ($scope.becario.fechaInicio != null) {
                        $scope.becario.fechaInicio = new Date($scope.becario.fechaInicio);
                        if ($scope.becario.fechaInicio.getFullYear() == 1900 || $scope.becario.fechaInicio.getFullYear() == 1899) {
                            $scope.inicioAux = $scope.becario.fechaInicio;
                            $scope.becario.fechaInicio = null;
                        }
                    }


                    if ($scope.becario.fechaTermino != null) {
                        $scope.becario.fechaTermino = new Date($scope.becario.fechaTermino);
                        if ($scope.becario.fechaTermino.getFullYear() == 1900 || $scope.becario.fechaTermino.getFullYear() == 1899) {
                            $scope.inicioAux = $scope.becario.fechaTermino;
                            $scope.becario.fechaTermino = null;
                        }
                    }

                    $scope.institucionselect = $scope.becario.institucion;
                    //$scope.adjuntos = $scope.becario.adjuntoBecarioExterno;

                    $scope.registro.nombrePersona = $scope.nomGF;
                    $scope.registro.clavePersona = $scope.becario.becario_ClavePersona;
                    
                },
                function (err) {
                    console.error(err);
                });
        }
        $scope.obtieneinformacionbe();

        $scope.regresar=function(){
            $state.go("fichapersonal.becarioexterno", { seccion: 'becarioexterno' });
        }

        //obtener instituciones 
        $scope.obtenerinstituciones = function () {
            BecarioExternoServiceCH.getInstituciones().then(
                function (result) {
                    $scope.instituciones = result.data;
                },
                function (err) {
                    toastr.error("No se han podido cargar el catalogo de instituciones.");
                }
            );
        }
        $scope.obtenerinstituciones();

        //Get TipoBeca
        $scope.obtenertipobeca = function () {
            BecarioExternoServiceCH.getTipoBeca().then(
                function (result) {
                    $scope.tipoBeca = result.data;

                },
                function (err) {
                    toastr.error("No se han podido cargar el catalogo de tipo de beca.");
                }
            );
        }
        $scope.obtenertipobeca();



        $scope.Actualizar = function () {
            if ($scope.becario.estadoFlujoId == 3) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'app/vistasGenericas/modificarValidados.html', controller: function ($uibModalInstance) {
                        $scope.ok = function () {
                            $scope.ActualizarF();
                            $uibModalInstance.dismiss('cancel'); $scope.dtInstance._renderer.rerender();
                        }; $scope.cancel = function () { $uibModalInstance.dismiss('cancel'); };
                    }, scope: $scope
                });
            } else {
                $scope.ActualizarF();
            }
        }

        //Guardar Cambios
        $scope.ActualizarF = function () {
            if ($scope.fromBecario.$invalid) {
                toastr.error("Complete los datos requeridos");
                return false;
            }


   if ($scope.becario.fechaInicio >= $scope.becario.fechaTermino) {
                    toastr.error("La fecha de inicio debe ser menor a la de término");
                    return false;
                }


            $scope.desabilitar = true;
            $scope.becario.institucionID = $scope.institucionselect.institucionID;
            if ($scope.becario.estadoFlujoId === 3) {
                $scope.becario.estadoFlujoId = 1;
            }
           
            for (var i = 0; i < $scope.adjuntosEliminados.length; i++) {
                $scope.becario.adjuntoBecarioExterno.push($scope.adjuntosEliminados[i]);
            }

            var registro={
                "Becario_ClavePersona": $scope.registro.clavePersona,
                "TipoBecaId": $scope.becario.tipoBecaId,
                "FechaInicio": $scope.becario.fechaInicio,
                "FechaTermino": $scope.becario.fechaTermino,
                "BecarioExternoId":id
            };

            BecarioExternoServiceCH.ValidaRegistroDuplicado(registro).then(
                function(res){
                    if(res.data){
                        toastr.warning("Intente cambiar el tipo de beca, las fechas de inicio y término o el número de becario");
                        toastr.warning("Ya existe el registro!");
                        $scope.desabilitar = false;
                        return false;
                    }
                    BecarioExternoServiceCH.Update($scope.becario).then(
                        function (result) {
                            toastr.success(result.data);
                            $scope.desabilitar = false;
                            if ($scope.becario.fechaInicio != null) {
                                $scope.becario.fechaInicio = new Date($scope.becario.fechaInicio);
                                if ($scope.becario.fechaInicio.getFullYear() == 1900 || $scope.becario.fechaInicio.getFullYear() == 1899) {
                                    $scope.inicioAux = $scope.becario.fechaInicio;
                                    $scope.becario.fechaInicio = null;
                                }
                            }
        
        
                            if ($scope.becario.fechaTermino != null) {
                                $scope.becario.fechaTermino = new Date($scope.becario.fechaTermino);
                                if ($scope.becario.fechaTermino.getFullYear() == 1900 || $scope.becario.fechaTermino.getFullYear() == 1899) {
                                    $scope.inicioAux = $scope.becario.fechaTermino;
                                    $scope.becario.fechaTermino = null;
                                }
                            }
                            //$scope.becario.adjuntoBecarioExterno = null;
                            //BecarioExternoServiceCH.getById(id).then(
                            //    function (result) {
                            //        $scope.becario = result.data;
                            //        if ($scope.becario.proyecto!=null)
                            //            $scope.proyecto = $scope.becario.proyecto.nombre;
                            //        //$scope.becario.fechaInicio = new Date($scope.becario.fechaInicio);
                            //        //$scope.becario.fechaTermino = new Date($scope.becario.fechaTermino);
        
        
                            //        $scope.institucionesset = $scope.becario.institucion;
                            //        //$scope.adjuntos = $scope.becario.adjuntoBecarioExterno;
                            //    },
                            //    function (err) {
                            //        console.error(err);
                            //    });
                            $scope.fromBecario.$setPristine();
        
                        },
                        function (err) {
                            console.error(err);
                            $scope.desabilitar = false;
                            //$state.go("fichapersonal.becarioexterno", { seccion: 'becarioexterno' });
                        });
                },function(err){
                    console.log(err);
                }
            );
            
        }

        ///Validar rango de fechas

        $scope.validarFechasInicio = function () {
            $scope.fechaActual = new Date();
            $scope.inicioDateComparacion = new Date($scope.becario.fechaInicio);
            $scope.finalDateComparacion = new Date($scope.becario.fechaTermino);
          
            if ($scope.becario.fechaTermino != undefined && $scope.becario.fechaTermino!=null)
            if ($scope.inicioDateComparacion > $scope.finalDateComparacion) {
                toastr.error("Fecha de inicio deber ser menor a fecha de término.");
                $scope.becario.fechaInicio = "";
                return false;
            }
            if ($scope.inicioDateComparacion > $scope.fechaActual) {
                toastr.error("Fecha inicial deber ser menor a la de hoy");
                $scope.becario.fechaInicio = "";
                return;
            }
        }

        $scope.validarFechas = function () {
            $scope.fechaActual = new Date();
            $scope.inicioDateComparacion = new Date($scope.becario.fechaInicio);
            $scope.finalDateComparacion = new Date($scope.becario.fechaTermino);
            if ($scope.inicioDateComparacion > $scope.finalDateComparacion) {
                toastr.error("Fecha de inicio deber ser menor a fecha de término.");
                $scope.becario.fechaTermino = "";
                return false;
            }
            if ($scope.finalDateComparacion > $scope.fechaActual) {
                toastr.error("Fecha final deber ser menor a la de hoy");
                $scope.becario.fechaTermino = "";
                return false;
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
                var compara = angular.equals($scope.becario.becario_ClavePersona, selectedItem.clavePersona);
                if (compara == true) {
                    toastr.error("El becario y asesor no debe ser el mismo");
                    return false;
                }
                else {
                    $scope.becario.asesor_Nombre = selectedItem.nombreCompleto;
                    $scope.becario.asesor_ClavePersona = selectedItem.clavePersona;
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
                $scope.institucion.institucionID = selectedItem.institucionID;
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
                $scope.proyecto = selectedItem.nombre;
                $scope.becario.proyectoId = selectedItem.proyectoId;
                $scope.ProyectoSeleccionado = selectedItem;
                $scope.fromBecario.$setDirty();
            });
            $scope.desabilitarBuscarProyecto = false;
        }

        //--------------------------------------------------- logica de adjunto
        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {
            if (adjunto.files.length <= 0){
                return false;
            }
            //Que no exita el adjunto
            var igual = 0;
            var contador = 0;
            for (contador = 0; contador < $scope.becario.adjuntoBecarioExterno.length; contador++) {
                if (adjunto.length > 0) {
                    if (adjunto.files[0].name == $scope.becario.adjuntoBecarioExterno[contador].adjunto.nombre) {
                        igual = 1;
                    }
                }
            }
            
            if (igual > 0) {
                $("#filesGral").filestyle('clear');
                toastr.error("El adjunto ya existe");
                adjunto = '';
                return;
            }
            else {
                $scope.files = [];
                //                        $scope.files.push(adjunto.files[0]);
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
        }

        // CONFIRMATION.        
        function transferComplete(result) {
           
            $scope.$apply(function () {

                $scope.siguienteIG = false;

                if (!result.error) {

                    var cont = 0;
                    for (var o = 0; o < $scope.becario.adjuntoBecarioExterno.length; o++) {
                        if ($scope.becario.adjuntoBecarioExterno[o].adjunto.nombre == result.nameFile) {
                            cont++;
                        }
                    }

                    if (cont == 0) {
                        var RegistroFiles = {
                            adjunto: {
                                "rutaCompleta": result.fullPathFile,
                                "nombre": result.nameFile,
                                "moduloId": "CH"
                            },
                            "becarioExternoId": $scope.auxid
                        }
                        $scope.becario.adjuntoBecarioExterno.push(RegistroFiles);
                        $scope.fromBecario.$setDirty();
                        //BecarioExternoServiceCH.Update($scope.becario).then(
                        //    function (result) {
                        //        $scope.obtieneinformacionbe();
                        //    });
                    }

                } else {
                    $("#filesGral").filestyle('clear');
                }
            });
        }
        //#endregion info gral

        //Eliminar el archivo adjunto
        $scope.OpenDelete = function (rowAdjuntoBecarioExterno) {
            // var idx = $scope.adjuntos[indx].adjunto.adjuntoId;
            // $scope.becario.adjuntoBecarioExterno[idx].adjunto.nombre = "eliminar";
            var contador = 0;
            if ($scope.becario.adjuntoBecarioExterno != null || $scope.becario.adjuntoBecarioExterno != undefined) {
                contador += $scope.becario.adjuntoBecarioExterno.length;
            }
            var files = contador;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisicaArchivo.html',
                controller: function ($uibModalInstance) {
                    $scope.ok = function () {
                        //servicio de eliminar AdjuntoBecarioExterno
                        // delete: 
                        //BecarioExternoServiceCH.deleteAdjuntoBecarioExterno(rowAdjuntoBecarioExterno.adjuntoBecarioExternoId).then(
                        //    function (sucess) {
                       
                        if (rowAdjuntoBecarioExterno.adjuntoId != undefined || rowAdjuntoBecarioExterno.adjuntoId != null) {
                            rowAdjuntoBecarioExterno.adjunto.nombre = "eliminar";
                            $scope.adjuntosEliminados.push(rowAdjuntoBecarioExterno);
                        }
                                var idx = ($scope.becario.adjuntoBecarioExterno.indexOf(rowAdjuntoBecarioExterno));
                                $scope.becario.adjuntoBecarioExterno.splice(idx, 1);
                                $uibModalInstance.dismiss('cancel');
                        //    },
                        //    function (error) {
                        //        $uibModalInstance.dismiss('cancel');
                        //    }
                        //);

                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };


        $scope.validar = function () {
            try {
                if ($scope.fromBecario.$invalid) {
                    toastr.error("Complete los datos requeridos");
                    return false;
                } else {
                    //Agregar archivos 
                    



                if ($scope.becario.fechaInicio >= $scope.becario.fechaTermino) {
                    toastr.error("La fecha de inicio debe ser menor a la de término");
                    return false;
                }



                    $scope.becario.estadoFlujoId = 2;
                    var Registro = {
                        "becarioExternoId": $scope.becario.becarioExternoId,
                        "estadoFlujoId": 2,
                    };
                    
                    //Cambiar el estado del registro
                    $scope.desabilitar = true;
                    BecarioExternoServiceCH.Update($scope.becario).then(
                        function (result) {
                            var Solicitud = {
                                "ClavePersona": $scope.becario.becario_ClavePersona,
                                "TipoInformacionId": 13,
                                "InformacionId": $scope.becario.becarioExternoId,
                                "FechaSolicitud": new Date(),
                                "EstadoFlujoId": 2,
                                "titulo": $scope.becario.titulo
                            }
                            BecarioExternoServiceCH.AddSolicitud(Solicitud).then(
                                function (result) {
                                    //Bitacora
                                    var Bitacora = {
                                        "SolicitudId": result.data,
                                        //"FechaMovimiento": new Date().toLocaleString('en-US', { timeZone: 'America/Mexico_City' }),
                                        "FechaMovimiento": new Date('dd/MM/yyyy'),
                                        "ClavePersona": $scope.becario.becario_ClavePersona,
                                        "Descripcion": "Se envió la solicitud",
                                        "EstadoFlujoId": 1
                                    }
                                    BecarioExternoServiceCH.AddBitacoraSolicitud(Bitacora);
                                    ////////////////
                                    var Mail = {
                                        "Modulo": "Capital Humano",
                                        "Empleado": $scope.becario.becario_Nombre,
                                        "Seccion": "Becario Externo",
                                        "TipoCorreo": 1,
                                        "ClavePersona": $scope.becario.becario_ClavePersona
                                    }
                                    BecarioExternoServiceCH.mailNotificacion(Mail);
                                    toastr.success("¡Solicitud Enviada!");
                                    $state.go("fichapersonal.becarioexterno", { seccion: 'becarioexterno' });
                                })
                        },
                        function (err) {
                            $scope.desabilitar = false;
                            $state.go("fichapersonal.becarioexterno", { seccion: 'becarioexterno' });
                            console.error(err);
                        });
                }
            } catch (e) {
                console.log(e);
                throw e;
            }

        }

        $scope.clean = function () {
            $scope.proyecto = null;
            $scope.becario.proyectoId = null;
        }

    }
})();