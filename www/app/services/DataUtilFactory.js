(function () {
    'use strict';
    angular
        .module('starter')
        .factory('DataUtil', DataUtilFactory);

    function DataUtilFactory() {

        return {
            parseData   : parseData,
            parseString : parseString,
            getDate     : getDate,
            formatDate  : formatDate,
            getMonthName: getMonthName,
            getFirstDay : getFirstDay,
            getLastDay  : getLastDay
        };

        function parseData(string) {
            var parts = string.split('-');
            return new Date(parts[0], parts[1] - 1, parts[2]);
        }

        function parseString(data) {
            return new Date(data).toLocaleDateString();
        }


        function getDate() {
            var data   = new Date();
            var inicio = "00";
            var year   = data.getFullYear();
            var month  = (inicio + (data.getMonth() + 1)).slice(-inicio.length);
            var day    = (inicio + (data.getDate())).slice(-inicio.length);
            return year + '-' + month + '-' + day;
        }

        function formatDate(milliseconds) {
            var data   = new Date(milliseconds);
            var inicio = "00";
            var year   = data.getFullYear();
            var month  = (inicio + (data.getMonth() + 1)).slice(-inicio.length);
            var day    = (inicio + (data.getDate())).slice(-inicio.length);
            return year + '-' + month + '-' + day;
        }

        function getMonthName(data) {
            var meses = [
                'Janeiro',
                'Feveiro',
                'Março',
                'Abril',
                'Maio',
                'Junho',
                'Julho',
                'Agosto',
                'Setembro',
                'Outubro',
                'Novembro',
                'Dezembro'
            ];
            return meses[data.getMonth()];
        }

        function getFirstDay(data) {
            var year  = data.getFullYear();
            var month = data.getMonth();
            return new Date(year, month, 1);
        }

        function getLastDay(data) {
            var year  = data.getFullYear();
            var month = data.getMonth() + 1;
            return new Date(year, month, 0);
        }


    }

})();
