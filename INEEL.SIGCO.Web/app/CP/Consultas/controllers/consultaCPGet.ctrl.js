(function () {
    "use strict";

    angular
        .module("ineelCP")
        .controller("consultaCPGetCtrl", [
            "AuthService",
            "$scope",
            "$timeout",
            "ComunidadesCPService",
            "CategoriaCPService",
            "ExportJsPDF",
            consultaCPGetCtrl
        ]);

    function consultaCPGetCtrl(AuthService, $scope, $timeout, ComunidadesCPService, CategoriaCPService, ExportJsPDF) {
        $scope.authentication = AuthService.authentication;
       
        $scope.reporte = [];
        $scope.resultadoReporte = {};
        $scope.imprime = false;
        $scope.logo = logoINEELrepot_;

        $scope.idRol = -8;
        $scope.idTipoFiltro = 0;
        //imprime el pdf

        $scope.jsPDF_ExportPDF = function (divID, file, alto) {
            alto = (document.getElementById(divID).offsetHeight);
            $timeout(function () {
            $scope.imprime = true;
            toastr.success("Generando reporte, espere....");
            ExportJsPDF.toPDF(divID, file, alto).then(function (response) {
                $scope.imprime = false;
            },
                function (error) { console.log(error); }
            );
         },100);


        }
        
        //carga las categorias
        $scope.cargaCategorias = function () {
            CategoriaCPService.getAllCategoriasActivas().then(
               function (result) {
                   $scope.categorias = result.data;
               },
               function (err) {
                   toastr.error("No se han podido cargar los registros");
                   console.log(err);
               });
        }

        //llama al repo de comunidades y trae toda la informacion del informe
        $scope.obtenDatosInforme = function () {
            ComunidadesCPService.getInformes2().then(
              function (result) {
                  
                  $scope.comunidades = result.data;
                  $scope.obtenTodas();
                  $scope.agregaOpcionTodas();
                
              },
              function (err) {
                  toastr.error("No se han podido cargar los registros");
                  console.log(err);
              });
        }


        $scope.obtenTodas = function () {        
            var cont = 0;
            $scope.resultadoReporte = [];
                    
            for (var i = 0; i < $scope.categorias.length; i++) {

                for (var j = 0; j < $scope.comunidades.length; j++) {

                    if (parseInt($scope.categorias[i].catCPId) == parseInt($scope.comunidades[j].idCategoria)) {
                        if ($scope.FechaInicio != null && $scope.FechaTermino != null) {
                            $scope.inicioDateComparacion = new Date($scope.FechaInicio);
                            $scope.finalDateComparacion = new Date($scope.FechaTermino);

                            var fechaCompara = new Date($scope.comunidades[j].fecha);

                            if (fechaCompara >= $scope.inicioDateComparacion && fechaCompara <= $scope.finalDateComparacion) {
                                $scope.reporte.push($scope.comunidades[j]);
                                cont = cont + 1;
                            }

                        } else {
                            $scope.reporte.push($scope.comunidades[j]);
                            cont = cont + 1;

                        }
                    }
                }

                var categorias = {
                    "nombreCategoria": $scope.categorias[i].nombre,
                    "cantidad": cont,
                }

                var info = {
                    "categoria": categorias,
                    "resultadoConsulta": $scope.reporte
                }

                $scope.resultadoReporte[i] = info;

                cont = 0;
                categorias = {};
                info = {};
                $scope.reporte = [];

            }
        }


        $scope.validaFechas = function () {
            //$scope.buscaPorCategoria();
            var cont = 0;
            $scope.resultadoReporte = [];
            for (var j = 0; j < $scope.comunidades.length; j++) {
                if ($scope.FechaInicio != null && $scope.FechaTermino != null) {

                    $scope.inicioDateComparacion = new Date($scope.FechaInicio);
                    $scope.finalDateComparacion = new Date($scope.FechaTermino);

                    var fechaCompara = new Date($scope.comunidades[j].fecha);
                    if (fechaCompara >= $scope.inicioDateComparacion && fechaCompara <= $scope.finalDateComparacion) {
                        $scope.reporte.push($scope.comunidades[j]);
                        cont = cont + 1;
                    }
                } else {
                    $scope.reporte.push($scope.comunidades[j]);
                    cont = cont + 1;

                }
            }
       
            var info = {
                "categoria": 0,
                "resultadoConsulta": $scope.reporte
            }
            $scope.resultadoReporte = info;

            cont = 0;
            //categorias = {};
            info = {};
            $scope.reporte = [];

        }

        //busca solo por categorias
        $scope.buscaPorCategoria = function () {

            var cont = 0;
            var nomCat = "";

            $scope.resultadoReporte = [];
            
            if ($scope.idCategoria == undefined) {
                $scope.obtenTodas();
            } else {

                if ($scope.idCategoria == -1 || $scope.idCategoria == -2) {
                    $scope.obtenTodas();
                } else {

                        for (var i = 0; i < $scope.categorias.length; i++) {
                            if (parseInt($scope.idCategoria) == parseInt($scope.categorias[i].catCPId)) {
                                nomCat = $scope.categorias[i].nombre;
                            }
                        }

                        for (var j = 0; j < $scope.comunidades.length; j++) {
                            if (parseInt($scope.idCategoria) == parseInt($scope.comunidades[j].idCategoria)) {

                                if ($scope.FechaInicio != null && $scope.FechaTermino != null) {
                                    $scope.inicioDateComparacion = new Date($scope.FechaInicio);
                                    $scope.finalDateComparacion = new Date($scope.FechaTermino);

                                    var fechaCompara = new Date($scope.comunidades[j].fecha);


                                    if (fechaCompara >= $scope.inicioDateComparacion && fechaCompara <= $scope.finalDateComparacion) {
                                        $scope.reporte.push($scope.comunidades[j]);
                                        cont = cont + 1;
                                    }

                                } else {
                                    $scope.reporte.push($scope.comunidades[j]);
                                    cont = cont + 1;
                                }
                            }
                        }

                        var categorias = {
                            "nombreCategoria": nomCat,
                            "cantidad": cont,
                        }

                        var info = {
                            "categoria": categorias,
                            "resultadoConsulta": $scope.reporte
                        }

                        $scope.resultadoReporte = info;

                        cont = 0;
                        categorias = {};
                        info = {};
                        $scope.reporte = [];
                   
                }
            }
        }


        $scope.limpiaCampos=function() {
            $scope.FechaInicio = null;
            $scope.FechaTermino = null;
            $scope.idTipoFiltro = 0;
            $scope.idCategoria = null;
        }

        $scope.obtenSoloTabla = function () {
      
            var cont = 0;
            $scope.resultadoReporte = [];


            for (var j = 0; j < $scope.comunidades.length; j++) {
                if ($scope.FechaInicio != null && $scope.FechaTermino != null) {  //compara fechas, si no hay fecha a buscar por default se agregan las comunidades
                    $scope.inicioDateComparacion = new Date($scope.FechaInicio);
                    $scope.finalDateComparacion = new Date($scope.FechaTermino);

                    var fechaCompara = new Date($scope.comunidades[j].fecha);

                    if (fechaCompara >= $scope.inicioDateComparacion && fechaCompara <= $scope.finalDateComparacion) {
                        $scope.reporte.push($scope.comunidades[j]);
                    }
                } else {
                    $scope.reporte.push($scope.comunidades[j]);
                }
            }

            var categorias = {
                "nombreCategoria": "",
                "cantidad": 0,
            }

            var info = {
                "categoria": categorias,
                "resultadoConsulta": $scope.reporte
            }

            $scope.resultadoReporte = info;

            cont = 0;
            categorias = {};
            info = {};
            $scope.reporte = [];


        }


        $scope.otrasOpciones = function () {

          
          
            if ($scope.idTipoFiltro == 1 || $scope.idTipoFiltro == 2 || $scope.idTipoFiltro == 3 || $scope.idTipoFiltro == 4) {
                if ($scope.idTipoFiltro == 3 || $scope.idTipoFiltro == 1) {
                    $scope.nombreComunidad = null;
                }

                if ($scope.idTipoFiltro == 4) {
                  
                    $scope.idCategoria = -1;
                    $scope.idRol = 10;

                }

                $scope.obtenSoloTabla();
            }

        }



        $scope.agregaOpcionTodas = function () {
            var numElementos = $scope.categorias.length;

            var nuevaCat = {
                "nombre": "Todas ",
                "descripcion": "Todas",
                "catCPId": "-1",
            }

            $scope.categorias.splice(numElementos, 0, nuevaCat);

          

        }

        $scope.cargaCategorias();

        $scope.obtenDatosInforme();
       
     

    }

})();