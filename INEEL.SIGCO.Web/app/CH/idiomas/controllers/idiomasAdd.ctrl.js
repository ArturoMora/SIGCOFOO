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
        .directive('validNumber', function () {
            return {
                require: '?ngModel',
                link: function (scope, element, attrs, ngModelCtrl) {

                    element.on('keydown', function (event) {
                        var keyCode=[]
                        if(attrs.allowNegative == "true")
                        { keyCode = [8, 9, 36, 35, 37, 39, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 109, 110, 173, 190,189];
                        }
                        else{
                            var keyCode = [8, 9, 36, 35, 37, 39, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 110, 173, 190];
                        }
              
              
                        if(attrs.allowDecimal == "false") {
                
                            var index = keyCode.indexOf(190);


                            if (index > -1) {
                                keyCode.splice(index, 1);
                            }
                
                        }
                        
                    })
                    ngModelCtrl.$parsers.push(function (text) {
                        var oVal = ngModelCtrl.$modelValue;
                        var nVal = ngModelCtrl.$viewValue;
                        console.log(nVal);
                        if (parseFloat(nVal) != nVal) {

                            if (nVal === null || nVal === undefined || nVal == '' || nVal == '-') oVal = nVal;

                            ngModelCtrl.$setViewValue(oVal);
                            ngModelCtrl.$render();
                            return oVal;
                        }
                        else {
                            var decimalCheck = nVal.split('.');
                            if (!angular.isUndefined(decimalCheck[1])) {
                                if(attrs.decimalUpto)
                                    decimalCheck[1] = decimalCheck[1].slice(0, attrs.decimalUpto);
                                else
                                    decimalCheck[1] = decimalCheck[1].slice(0, 2);
                                nVal = decimalCheck[0] + '.' + decimalCheck[1];
                            }

                            ngModelCtrl.$setViewValue(nVal);
                            ngModelCtrl.$render();
                            return nVal;
                        }
                    });
                }
            };
        })
        .controller("idiomasAddCtrl", ['$rootScope','AuthService', '$scope', 'IdiomasService', "IdiomaService", '$state', 'uploadFileACH','globalGet','$filter', idiomasAddCtrl]);
    function idiomasAddCtrl($rootScope, AuthService, $scope, IdiomasService, IdiomaService, $state, uploadFileACH, globalGet, $filter) {
        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 13) {
                    return false;
                }
            });
        });
        $scope.bloquear = true;
        window.scrollTo(0, 0)
        var API = globalGet.get("api");
        //get usuario
        //Extraer informacion del usuario//
        $scope.registroidiomas = {};
        //Inicializacion de porcentajes
        $scope.registroidiomas.porcentajeGradoDominio = 1;
        $scope.registroidiomas.porcentajeConversacion = 1;
        $scope.registroidiomas.porcentajeEscritura = 1;
        $scope.registroidiomas.porcentajeLectura = 1;
        $scope.authentication = AuthService.authentication;


        //Gestion de ficha
        $scope.idGF = $rootScope.GestionFichasClave;
        $scope.nomGF = $rootScope.GestionFichasNombre;
        $scope.registro = { nombreEmpleado: '' };
        if ($scope.idGF == null) {
            $scope.registroidiomas.clavePersona = AuthService.authentication.userprofile.clavePersona;
            $scope.nombreEmpleado = AuthService.authentication.nombreCompleto;
        } else {
            $scope.registroidiomas.clavePersona = $scope.idGF;
            $scope.nombreEmpleado = $scope.nomGF;
        }
        $scope.registro.nombrePersona = $scope.nombreEmpleado;

        IdiomaService.getAll().then(
            function (result) {
                $scope.catalogoidiomas = result.data;
            }, function (error) {
                toastr.error("No se ha podido cargar el catalogo de idiomas ");
                console.error(err);
            });


        $(document).ready(function () {
            $("form").keypress(function (e) {
                if (e.which == 45) {
                    return false;
                }
            });
        });

        $scope.regresar=function(){
            $state.go("fichapersonal.idiomas",({seccion:'idiomas'}))
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
                    $scope.registroidiomas.Adjunto = {
                        "rutaCompleta": result.fullPathFile,
                        "nombre": result.nameFile,
                        moduloId: "CH"
                    }
                    $scope.idiomasform.$setDirty();
                }
            });
            
        }
        //#endregion info gral
        ///////////////////////////////////////////////////////////////
        $scope.certificados = function (id) {
            if(id!=null){
                $scope.bloquear = false;
                IdiomasService.getcetificacionesAll($scope.registroidiomas.idiomaId).then(
                function (result) {
                    $scope.catalogocertificaion = result.data;
                }, function (error) {
                    toastr.error("No se ha podido cargar el catalogo de certificaciones ");
                    console.error(err);
                });
            } else {

                $scope.bloquear = true;
                $scope.registroidiomas.certificacionId = null;
            }

        }

        $scope.idiomasadd = function () {
            toastr.clear();
            if ($scope.idiomasform.$invalid || typeof $scope.registroidiomas.idiomaId === 'Undefined' || $scope.registroidiomas.porcentajeGradoDominio == 0 || $scope.registroidiomas.porcentajeConversacion == 0 || $scope.registroidiomas.porcentajeEscritura == 0 || $scope.registroidiomas.porcentajeLectura == 0) {
                if ($scope.registroidiomas.porcentajeGradoDominio == 0) {
                    toastr.error("mayor que cero", "El porcentaje de dominio debe ser");
                }else
                toastr.error("Complete los datos requeridos");
                return false;
            } else {
                /////////////////
                $scope.hoy = new Date();
                $scope.hoyString = $filter('date')(new Date(), 'dd/MM/yyyy');
                if ($scope.registroidiomas.fechaAcreditacion > $scope.hoy) {
                    toastr.error("La fecha de acreditación debe ser menor a " + $scope.hoyString);
                    return false;
                }
                // Guardar registro 
                //por default cuando se agrega un registro el estdo del flujo es 1
                $scope.registroidiomas.estadoFlujoId = 1;
                //$scope.registroidiomas.clavePersona = AuthService.authentication.userprofile.clavePersona;
                //$scope.registroidiomas.ruPersona = AuthService.authentication.userprofile.ruPersona;
                //$scope.registroidiomas.fechaEfectiva = AuthService.authentication.userprofile.fechaEfectiva;
                //ingresar id del archivo, esta pendiente por validar 
                $scope.desabilitar = true;
                var registro={
                    "ClavePersona": $scope.authentication.userprofile.clavePersona,
                    "IdiomaId": $scope.registroidiomas.idiomaId,
                    "FechaAcreditacion": $scope.registroidiomas.fechaAcreditacion,
                };

                IdiomasService.ValidaRegistroDuplicado(registro).then(
                    function(res){
                        if(res.data){
                            toastr.warning("Intente cambiar el idioma o la fecha de acreditación");
                            toastr.warning("Ya existe el registro!");
                                
                            return false;
                        }
                        IdiomasService.create($scope.registroidiomas).then(
                            function (result) {
                                toastr.success(result.data);
                                $state.go("fichapersonal.idiomas", { seccion: 'idiomas' });
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