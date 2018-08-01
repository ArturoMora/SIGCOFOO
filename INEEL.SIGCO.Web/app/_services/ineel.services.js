(function () {
    "use strict";

    var app = angular.module("ineel.services", [])
    .directive('ngRightClick', function ($parse) {
        return function (scope, element, attrs) {
            var fn = $parse(attrs.ngRightClick);
            element.bind('contextmenu', function (event) {
                scope.$apply(function () {
                    event.preventDefault();
                    fn(scope, { $event: event });
                });
            });
        };
    })
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
    .filter('calculaEdad', function () {
        function mydiffDay(date1, date2) {
            var second = 1000, minute = second * 60, hour = minute * 60, day = hour * 24, week = day * 7;
            date1 = new Date(date1);
            date2 = new Date(date2);
            var timediff = date2 - date1;
            if (isNaN(timediff)) return NaN;
            var fecha = timediff / day;
            return fecha;
        }
        return function (FechaNacimiento) {
            var Fecha = new Date();
            var FechaNacimiento = new Date(FechaNacimiento);
            var dias = mydiffDay(Fecha, FechaNacimiento);
            var anios = dias / 365.25;
            anios =Math.abs(anios);
            var edad = Math.floor(anios);
            return edad;
        };
    })

        .filter('capitalize1', function () {
            return function (input, scope) {
                try {
                    var r = input.substring(0, 1).toUpperCase() + input.substring(1);
                    try {
                        r = r.trim();
                    } catch (ex) { }
                    
                    return r;
                } catch (e) { return input; }
            }
        })
        .filter('capitalize1AndLower', function () {
            return function (input, scope) {
                try {
                    var r = input.substring(0, 1).toUpperCase() + input.substring(1).toLowerCase();
                    try {
                        r = r.trim();
                    } catch (ex) { }

                    return r;
                } catch (e) { return input; }
            }
        })
        .filter('trim', function () {
            return function (value) {
                
                    try {
                        if (typeof type !== "string") {
                            return value.trim();
                        }
                    } catch (ex) {
                        return value;
                    }                    
            }
        })
                .filter('substr', function () {
                    return function (text, value) {
                        
                        var res = text;
                        try {
                            if (text != "" && text != undefined && text.length > value) {
                                res=text.substring(value, text.length)
                                }
                            if (text == null) {
                                res="Dato no disponible"                                
                            }
                            return res;
                        } catch (ex) {
                            return res;
                        }
                    }
                })
        .filter('concatPrefixIf', function () {
            return function (text, add) {
                var apend = ",";
                if (text == undefined || text == null || text == "") {
                    return null;
                }
                if (!(add == undefined || text == null || text == "")) {
                    apend = add;
                }
                return add + text;
            };
        })
        .filter('rangoYear', function () {
            return function (y1, y2, infijo, mayorQue) {
                //alert(y1 + " " + y2 + " " + infijo + " " + mayorQue);
                var invalido = false;
                try {
                    if (mayorQue == undefined || mayorQue == null || mayorQue == '') {
                        invalido = true;
                    } else {
                        if (!(parseInt(y1) > mayorQue && parseInt(y2) > mayorQue)) {
                            invalido = true;
                        }
                    }
                    if (y1 == y2 && !invalido) {
                        return y1;
                    } else {
                        if (!invalido) {
                            return y1 + infijo + y2;
                        } else {
                            return "";
                        }
                    }
                } catch (e) { return y1 }
            }
        })
        .filter('rangoDateCamel', function () {
            function camel(input) {
                try {
                    var r = input.substring(0, 1).toUpperCase() + input.substring(1);
                    return r;
                } catch (e) { return input; }
            };
            return function (y1, y2, infijo) {
                try {
                    if (y2 == undefined || y2 == null || y2 == 'null') {
                        return camel(y1);
                    }
                    try {
                        if (y2.toLowerCase().trim() == 'null') {
                            return camel(y1);
                        }
                    } catch (e) { return y1; }

                    if (y1 == y2) {
                        return camel(y1);
                    } else {
                        return camel(y1) + infijo + camel(y2);
                    }
                } catch (e) { return camel(y1); }
            };
        })
        .filter('upperChar', function () {
            return function (input, index) {
                try {
                    var upper = input.substring(index, index + 1).toUpperCase();

                    var prefix = input.substring(0, index);
                    var sufix = input.substring(index + 1);
                    var r = prefix + upper + sufix;
                    return r;

                } catch (e) { return input }
            }
        })
        .filter('getFecha', function () {
            return function (fechaRaw, msg) {
                try {
                    if (msg == undefined || msg == null || msg == "") {
                        msg = "Dato no disponible";
                    }
                    if (fechaRaw == undefined || fechaRaw == null || fechaRaw == "") {
                        return msg;
                    }

                    var date = new Date(fechaRaw);
                    var fecha = new Date();
                    fecha.setFullYear(1900);
                    fecha.setMonth(1);
                    fecha.setDate(1)
                    if (date > fecha) {
                        return date;
                    }
                    return msg;

                } catch (e) { return date }
            }
        })
        .filter('getYear', function () {
            return function (year, msg) {
                try {
                    if (msg == undefined || msg == null) {
                        msg = "Dato no disponible";
                    }
                    if (parseInt(year) > 1900) {
                        return year;
                    }
                    if (year == undefined || year == null || year == "") {
                        return msg;
                    }                   
                    return msg;

                } catch (e) { return date }
            }
        })
    .filter('toFemale', function () {
        function replace(input, index, character) {
            try {
                var x = input.substr(0, index);
                var y = input.substr(index + character.length);
                return input.substr(0, index) + character + input.substr(index + character.length);
            } catch (e) { return input; }
        }
        return function (input, condition) {
            if (condition == undefined || condition == null) {
                condition = true;
            }
            if (condition) {
                input = replace(input, input.length - 1, "a");
            }

            return input;

        }
    })
       .filter('getFloor', function () {
           return function (num) {
               try {
                   return Math.floor(num);
               } catch (e) { return num;}
           };
       })
        .filter('suprimeSufix', function () {
            return function (input, sufix) {
                try {
                    var str = input + "";
                    str = str.replace(sufix, "");
                    return str;

                } catch (e) { return input }
            }
        })
    .filter('unique1', function () {

        return function (items, filterOn) {

            if (filterOn === false) {
                return items;
            }

            if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
                var hashCheck = {}, newItems = [];

                var extractValueToCompare = function (item) {
                    if (angular.isObject(item) && angular.isString(filterOn)) {
                        return item[filterOn];
                    } else {
                        return item;
                    }
                };

                angular.forEach(items, function (item) {
                    var valueToCheck, isDuplicate = false;

                    for (var i = 0; i < newItems.length; i++) {
                        if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                            isDuplicate = true;
                            break;
                        }
                    }
                    if (!isDuplicate) {
                        newItems.push(item);
                    }

                });
                items = newItems;
            }
            return items;
        };
    });

})();

