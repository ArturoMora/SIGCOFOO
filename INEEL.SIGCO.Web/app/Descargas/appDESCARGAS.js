(function () {
    "use strict";

    angular.module("ineelDESCARGAS", ['ui.router',
        'LocalStorageModule',
        'ui.bootstrap',
        'ineel.services', "blockUI",
        'GlobalINEEL', 'mdo-angular-cryptography'])
        .config(["$stateProvider", "$urlRouterProvider", RouterProvider])
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push('authInterceptorService');
        }).config(function (blockUIConfig) {
            blockUIConfig.message = 'Espere...';
            blockUIConfig.delay = 0;// Change the default delay to N ms before the blocking is visible
        }).config(['$cryptoProvider', function ($cryptoProvider) {
            $cryptoProvider.setCryptographyKey('SIGCO3');
        }]);

    function RouterProvider($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("home");

        $stateProvider
            .state("home", {
                url: "/home",
                templateUrl: "app/Descargas/Vistas/home.html"
            })
            .state("q", {
                url: "/q/:id",
                templateUrl: "app/Descargas/Vistas/Descarga.html",
                controller: "DescargasQ"
            })
            .state("ITF", {
                url: "/ITF/:id/:fileName",
                templateUrl: "app/Descargas/Vistas/Descarga.html",
                controller: "DescargasITF"
            })
            .state("ITFcaratula", {
                url: "/ITFcaratula/:id/:fileName",
                templateUrl: "app/Descargas/Vistas/Descarga.html",
                controller: "DescargaITFcaratula"
            })
        
            .state("cursos", {
                url: "/cursos/:id",
                templateUrl: "app/Descargas/Vistas/Descarga.html",
                controller: "DescargasCursos"
            })
            .state("descargapv", {
                url: "/descargapv",
                templateUrl: "app/CR/clientes/proyectosvigentespdf.html",
                controller: "proyectosvigentesPDFCtrl"
            })
            .state("descargapio", {// pio descarga propuestas iniciativas oportunidades de negocio
                url: "/descargapio",
                templateUrl: "app/CR/clientes/propuestasiniciativasonpdf.html",
                controller: "propuestasiniciativasonPDFCtrl"
            });
    };

} ());

