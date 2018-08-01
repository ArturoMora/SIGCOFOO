angular.module('mdo-angular-cryptography', [])
    .provider('$crypto', function CryptoKeyProvider() {
        var cryptoKey;

        this.setCryptographyKey = function (value) {
            
            cryptoKey = value;
        };

        this.$get = [function(){
            return {
                getCryptoKey: function () {
                    
                    return cryptoKey
                },

                encrypt: function(message, key) {

                    if (key === undefined) {
                        key = cryptoKey;
                    }
                    var result = CryptoJS.AES.encrypt(message, key).toString();
                    
                    result = result.replace(/\//g, "@@@");
                    return result;
                },

                decrypt: function(message, key) {

                    if (key === undefined) {
                        key = cryptoKey;
                    }
                    message = message.replace(/@@@/g, "/");                    
                    return  CryptoJS.AES.decrypt(message, key).toString(CryptoJS.enc.Utf8);
                }
            }
        }];
    });