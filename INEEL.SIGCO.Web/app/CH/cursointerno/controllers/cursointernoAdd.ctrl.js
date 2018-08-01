(function () {
    "use strict";

    angular
        .module("ineel.controllers")
        .controller("cursointernoAddCtrl"
            , ['$rootScope','AuthService'
            , '$scope'
            , 'CursoInternoCHService'
            , 'globalGet'
            , 'uploadFileACH'
            , '$state'
            , '$filter'
            , '$uibModal'
            , 'DTOptionsBuilder'
            , cursointernoAddCtrl]);
    function cursointernoAddCtrl($rootScope,AuthService, $scope, CursoInternoCHService, globalGet, uploadFileACH, $state, $filter, $uibModal, DTOptionsBuilder) {
        //Variable API
        window.scrollTo(0, 0);
        var API = globalGet.get("api");
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });

        //Gestion de ficha
        $scope.AutoresIIE = [];
        
        $scope.idGF = $rootScope.GestionFichasClave;
        $scope.nomGF = $rootScope.GestionFichasNombre;
        var origenCH = $rootScope.getOrigen() == 'CH' ? true : false;
        
        if ($scope.idGF == null) {
            $scope.clavePersona = AuthService.authentication.userprofile.clavePersona;
            $scope.nombreEmpleado = AuthService.authentication.nombreCompleto;
        } else {
            $scope.clavePersona = $scope.idGF;
            $scope.nombreEmpleado = $scope.nomGF;
        }
            var Registro = {
                "clavePersona": $scope.clavePersona,
                "nombrePersona": $scope.nombreEmpleado,
                "nombreCompleto": $scope.nombreEmpleado
            }
            for (var i = 0; i < $scope.AutoresIIE.length; i++) {
                if ($scope.AutoresIIE[i].clavePersona == Registro.clavePersona) {
                    toastr.error("El autor " + Registro.nombreCompleto + " ya existe dentro de la tabla de autores!");
                    $scope.PersonaSeleccionada = null;
                    return false;
                }
            }
            $scope.userAdd = false;
            $scope.PersonaSeleccionada = null;
            $scope.AutoresIIE.push(Registro);




        $scope.authentication = AuthService.authentication;
       
        $scope.auxColabora = [];
        $scope.AutoresExt = [];
        $scope.contador = 0;
        $scope.archivosAdjuntos = [];
        $scope.sitiosWeb = [];

        $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('rt').withDisplayLength(-1);

        $scope.registro = Registro;
        $scope.registro.privadoPublico = 1;
        $scope.registro.perteneceCP = 0;
        

        $scope.autorIIE = {};
        $scope.catNum = [{
            "id": "10",
            "descripcion": "10%"
        }, {
            "id": "20",
            "descripcion": "20%"
        }, {
            "id": "30",
            "descripcion": "30%"
        }, {
            "id": "40",
            "descripcion": "40%"
        }, {
            "id": "50",
            "descripcion": "50%"
        }, {
            "id": "60",
            "descripcion": "60%"
        }, {
            "id": "70",
            "descripcion": "70%"
        }, {
            "id": "80",
            "descripcion": "80%"
        }, {
            "id": "90",
            "descripcion": "90%"
        }];


        CursoInternoCHService.getTipoCurso().then(
             function (result) {
                 //$scope.cursos = result.data;
                 $scope.cursos = [];
                 var cont2 = 0;
                 for (var cont = 0; cont < result.data.length; cont++) {
                     if (result.data[cont].estado == true) {
                         $scope.cursos[cont2] = result.data[cont];
                         cont2++;
                     }
                 }
             },
            function (err) {
                toastr.error("No se han podido cargar el catalogo de tipos de cursos.");
            }
            );


        $scope.validarFechas = function () {
            $scope.fechaActual = new Date();
            $scope.finalDateComparacion = new Date($scope.registro.fechaCurso);
            if ($scope.finalDateComparacion >= $scope.fechaActual) {
                toastr.error("Fecha de inicio del congreso deber ser menor a la fecha actual");
                $scope.registro.fechaCurso = "";
                return false;
            }
        }



        $scope.validarFechas2 = function () {
            $scope.fechaActual = new Date();
            $scope.finalDateComparacion = new Date($scope.registro.fechaTermino);
            if ($scope.finalDateComparacion >= $scope.fechaActual) {
                toastr.error("Fecha de termino del congreso deber ser menor a la fecha actual");
                $scope.registro.fechaCurso = "";
                return false;
            }
        }


        $scope.regresar=function(){
            $state.go("fichapersonal.cursointerno", { seccion: 'cursointerno' });
        }

        /////////////////////////Buscar Proyecto
        //Buscar Proyecto
        //$scope.ProyectoSeleccionado = {};
        $scope.verproyecto = false;
        $scope.openProyecto = function () {
            $scope.desabilitar = true;
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
                $scope.registro.proyectoNombre = selectedItem.nombre;
                $scope.registro.proyectoId = selectedItem.proyectoId;
                $scope.ValidForm.$setDirty();
                //$scope.ProyectoSeleccionado = selectedItem;
            });
            $scope.desabilitar = false;
        }
        //////////////////////Buscar persona////////////
        $scope.PersonaSeleccionada = {};
        $scope.openUser = function () {
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
                scope: $scope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.PersonaSeleccionada = selectedItem;
                $scope.autorIIE.clavePersona = $scope.PersonaSeleccionada.clavePersona;
                $scope.autorIIE.nombrePersona = $scope.PersonaSeleccionada.nombreCompleto;
                $scope.userAdd = true;
                $scope.add_user();
                $scope.ValidForm.$setDirty();
            });
        }
        //#region info gral, GET THE FILE INFORMATION.
        $scope.getFileDetails = function (adjunto) {if (adjunto.files.length <= 0){return false;}
            
            //Que no exita el adjunto
            var igual = 0;
            var contador = 0;
            for (contador = 0; contador < $scope.archivosAdjuntos.length; contador++) {
                if (adjunto.files[0].name == $scope.archivosAdjuntos[contador].nombre) {
                    igual = 1;
                }
            }
            if (igual > 0) {
                toastr.error("El adjunto ya existe");
                adjunto = '';
                $("#filesGral").filestyle('clear');
                return;
            }
            else {
                $scope.files = null;
                $scope.files = [];
                $scope.files.push(adjunto.files[0]);
                $scope.archivos = adjunto.files.length;
                
                // $scope.uploadFiles();
                var propiedades = {
                    file: adjunto.files[0],
                    ext: "*", /* pdf;doc;docx;ppt */
                    type: '*', /* */
                    size: '8', /* cantidad entera en MB*/
                    api: API + "FileUploadMT/UploadFiles/"
                }
                uploadFileACH.upload(propiedades,
                function (err, result) {
                    
                    if (!err) {
                        console.log("result:");
                        console.log(result);
                        $("#filesGral").filestyle('clear');
                        
                        if (!result.error) {
                            transferComplete(result);
                            $("#filesGral").filestyle('clear');
                        } else {
                            toastr.error(result.message);
                            $("#filesGral").filestyle('clear');
                        }
                    } else {
                        var error = err.message || "Error al adjuntar";
                        $("#filesGral").filestyle('clear');
                        toastr.error(error);
                    }
                    
                });
                $("#filesGral").filestyle('clear');
            };
        }
    
        function transferComplete(result) {
            console.log("aqui");
            console.log(result);
            $scope.$apply(function () {
                if (result.error === false) {
                    //$scope.registrofa.AdjuntoId = result.fullPathFile;
                    //agregarlo al modelo
                    $scope.registro.adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CH"
                    }
                    var cont = 0;
                    for (var o = 0; o < $scope.archivosAdjuntos.length; o++)
                    {
                        if ($scope.archivosAdjuntos[o].nombre == result.nameFile) {
                            cont++;
                        }
                    }
                    if (cont == 0) {
                        $scope.archivosAdjuntos.push($scope.registro.adjunto);
                    }
                
                    $scope.existFile = 1;
                    $scope.ValidForm.$setDirty();
                   
                }
            });
        }

        //Funcion para agregar registro
        $scope.add = function () {
            if ($scope.ValidForm.$invalid && false) {
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                if ($scope.AutoresIIE.length == 0) {
                    toastr.error("Complete los datos requeridos");
                    return false;
                }
                else {
                    if ($scope.registro.fechaCurso > $scope.registro.fechaTermino && ($scope.registro.fechaTermino != null)) {
                        toastr.error("La fecha de inicio debe ser menor a la de término");
                        return false;
                    } else {

                        if ($scope.registro.perteneceCP == 1) {
                            $scope.registro.perteneceCP = true;
                        } else { $scope.registro.perteneceCP = false; }
                        $scope.desactivar = true;
                        $scope.registro.estadoFlujoId = 1;
                        $scope.registro.clavePersona = $scope.clavePersona;
                        CursoInternoCHService.add($scope.registro).then(
                            function (result) {
                                var cursoInternoId = result.data.cursoInternoId;
                                for (var iie = 0; iie < $scope.AutoresIIE.length; iie++) {
                                    var Registro = {
                                        "CursoInternoId": cursoInternoId,
                                        "clavePersona": $scope.AutoresIIE[iie].clavePersona,
                                        "nombreCompleto": $scope.AutoresIIE[iie].nombrePersona
                                    }
                                    CursoInternoCHService.AddUser(Registro).then(
                                                        function (result) {
                                                        });
                                }
                                for (var iie = 0; iie < $scope.AutoresExt.length; iie++) {
                                    var Registro = {
                                        "CursoInternoId": cursoInternoId,
                                        "nombreCompleto": $scope.AutoresExt[iie].nombre,
                                        "institucion": $scope.AutoresExt[iie].institucion
                                    }
                                    CursoInternoCHService.AddUserExt(Registro).then(
                                                        function (result) {
                                                        });
                                }

                                for (var files = 0; files < $scope.archivosAdjuntos.length; files++) {
                                    var RegistroFiles = {
                                        "RutaCompleta": $scope.archivosAdjuntos[files].rutaCompleta,
                                        "nombre": $scope.archivosAdjuntos[files].nombre,
                                        "ModuloId": $scope.archivosAdjuntos[files].moduloId,
                                        "CursoInternoId": cursoInternoId
                                    }
                                    CursoInternoCHService.AddFile(RegistroFiles);

                                }
                                for (var sitios = 0; sitios < $scope.sitiosWeb.length; sitios++) {
                                    var RegistroSitios = {
                                        "Url": $scope.sitiosWeb[sitios],
                                        "Descripcion": $scope.sitiosWeb[sitios],
                                        "FechaRegistro": new Date(),
                                        "Autor": $scope.registro.nombrePersona,
                                        "Estado": true,
                                        "CursoInternoId": cursoInternoId
                                    }
                                    
                                    CursoInternoCHService.AddSitios(RegistroSitios);

                                }
                                
                                toastr.success("Registro creado exitosamente!");
                                
                                if (origenCH) {
                                    $state.go("fichapersonal.cursointerno", { seccion: 'cursointerno' });
                                } else {
                                    $rootScope.globalRegresar();
                                }
                                
                            },
                            function (err) {
                                $scope.desactivar = false;                                
                                console.error(err);
                                $rootScope.globalRegresar();
                            });
                    }
                }
            }
        }

        $scope.add_user = function () {
                    var Registro = {
                        "clavePersona": $scope.autorIIE.clavePersona,
                        "nombreCompleto": $scope.autorIIE.nombrePersona
                    }
                    for (var i = 0; i < $scope.AutoresIIE.length; i++) {
                        if ($scope.AutoresIIE[i].clavePersona == Registro.clavePersona) {
                            toastr.error("El autor " + Registro.nombreCompleto + " ya existe dentro de la tabla de autores!");
                            $scope.PersonaSeleccionada = null;
                            return false;
                        }
                    }
                    $scope.userAdd = false;
                    $scope.PersonaSeleccionada = null;
                    $scope.AutoresIIE.push(Registro);
        }


        $scope.add_File = function () {
            $scope.archivosAdjuntos.push($scope.registro.adjunto);
            $scope.registro.adjunto = null;
            $scope.existFile = 0;
        }

        $scope.eliminarFile = function (registro) {
            var idx = ($scope.archivosAdjuntos.indexOf(registro));
            $scope.archivosAdjuntos.splice(idx, 1);
        }

        $scope.eliminarAutor = function (registro) {
            $scope.descripcionRow = registro.nombreCompleto;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {

                        $scope.delete(registro, $uibModalInstance);
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                scope: $scope
            });
        };

        $scope.delete = function (registro, $uibModalInstance) {
            for (var i = 0; i < $scope.auxColabora.length; i++) {
                if ($scope.auxColabora[i].id == registro.contribucion) {
                    $scope.catNum.push($scope.auxColabora[i]);
                }
            }
            var idx = ($scope.AutoresIIE.indexOf(registro));
            $scope.AutoresIIE.splice(idx, 1);
            $uibModalInstance.dismiss('close');
            var porcentaje = parseInt(registro.contribucion);
            $scope.contador = $scope.contador - porcentaje;
            
        };

        $scope.cancel = function () {
            $scope.userAdd = false;
            $scope.autorIIE = null;

        }
        //////////////////////////////////////////////////////////////////////////
        $scope.add_userExt = function () {
            //if ($scope.contador < 100) {
            if ($scope.autorExt.nombre != null && $scope.autorExt.institucion) {
                var aux = parseInt($scope.autorExt.contribucion) + parseInt($scope.contador);
                    for (var i = 0; i < $scope.AutoresExt.length; i++) {
                        if (($scope.AutoresExt[i].nombre == $scope.autorExt.nombre) && ($scope.AutoresExt[i].institucion == $scope.autorExt.institucion)) {
                            toastr.error("El autor " + $scope.autorExt.nombre + " ya existe dentro de la tabla de autores!");
                            $scope.addExt = true;
                            return false;
                        }
                    }
                    
                    var porcentaje = parseInt($scope.autorExt.contribucion);
                    $scope.contador = $scope.contador + porcentaje;
                    $scope.addExt = false;
                    $scope.AutoresExt.push($scope.autorExt);
                    //Eliminar del drop
                    for (var i = $scope.catNum.length - 1; i >= 0; i--) {
                        if ($scope.catNum[i].id == $scope.autorExt.contribucion) {
                            $scope.auxColabora.push($scope.catNum[i]);
                            $scope.catNum.splice(i, 1);
                        }
                    }
                    $scope.autorExt = {};
                    $scope.ValidForm.$setDirty();

                //});
            } else {
                toastr.error("Complete los datos requeridos del autor externo");
            }

        }

        $scope.eliminarAutorExt = function (registro) {
            var porcentaje = parseInt(registro.contribucion);
            $scope.contador = $scope.contador - porcentaje;
            $scope.descripcionRow = registro.nombre;
            var modalInstance = $uibModal.open({
                templateUrl: 'app/vistasGenericas/eliminacionFisica.html',
                controller: function ($uibModalInstance) {

                    $scope.ok = function () {

                        $scope.deleteExt(registro, $uibModalInstance);
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };

                    var porcentaje = parseInt($scope.autorExt.contribucion);
                    $scope.contador = $scope.contador + porcentaje;
                },
                scope: $scope
            });
        };

        $scope.deleteExt = function (registro, $uibModalInstance) {
            for (var i = 0; i < $scope.auxColabora.length; i++) {
                if ($scope.auxColabora[i].id == registro.contribucion) {
                    $scope.catNum.push($scope.auxColabora[i]);
                }
            }
            var idx = ($scope.AutoresExt.indexOf(registro));
            $scope.AutoresExt.splice(idx, 1);
            $uibModalInstance.dismiss('close');
            
        };

        $scope.addLiga = function () {
            if ($scope.registro) { //se hace esta comparación para comprobar que no es undefined
                var liga = $scope.registro.descripcionLiga;
                if (liga != "" && liga != undefined) {
                    var idx = $scope.sitiosWeb.indexOf(liga);
                    if (idx > -1) {
                        toastr.error("La Liga de acceso indicada ya se encuentra asociada, indique otra");
                        
                    }
                    else {
                        $scope.sitiosWeb.push(liga);
                    }
                }
                else {
                    toastr.error("Se requiere un sitio Web, ejemplo: http://www.dominio.com");
                }
            } else {
                toastr.error("Se requiere un sitio Web, ejemplo: http://www.dominio.com");
            }

            $scope.registro.descripcionLiga = ''
        };

        $scope.deleteTask = function (index) {
            $scope.sitiosWeb.splice(index, 1);
        }

        $scope.clean = function () {
            $scope.registro.proyectoNombre = null;
            $scope.registro.proyectoId = null;
        }
    }
})();