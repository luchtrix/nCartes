var app = angular.module('secreto', []);
//var url_server = 'http://192.168.0.104:3001/';
var url_server = 'http://192.168.0.32:3001/';
var socket = io.connect(url_server);

$(document).ready(function (){
    $("#new").hide();
});

app.controller('operadorCtrl', ['$scope', '$http', function($scope, $http){
    //----------------------------------------------------
    var now = moment();//instanciando el objeto moment
    var usuario = localStorage.getItem("usuario")///----------------------------------nuevo|
    $scope.usuario = JSON.parse(usuario);// toda la informacion acerca del usuario
    var empresa = $scope.usuario.EMPIDC;//id de la empresa a la que esta relacionado       |

    $scope.viewForm = function(){
        $("#new").show();
        $("#main").hide();
    }

    $("#hideForm").click(function(){
        $("#new").hide();
        $("#main").show();
    })

    getTareas();
    getNotificaciones();

    function getTareas(){
        $scope.tareas = []
        $http.get(url_server+"tarea/buscar/"+$scope.usuario._id).success(function(response) {
            if(response.type) { // Si nos devuelve un OK la API...
                //$scope.tareas = response.data;
                for( var i = 0 ; i < response.data.length ; i++ ){
                    if(response.data[i].TARSTA != ''){
                        $scope.tareas.push(response.data[i]);
                    }
                }
                //alert("tareas "+$scope.tareas.length);
                /*response.data.forEach(function(t) {
                    var eficacia = ''
                    if (t.TARSTA == 'T') {
                        var dias_diferencia = restaFechas(t.date, t.TARES2)
                        if (dias_diferencia != NaN) {
                            if (efic < 0) {
                                var efic = ((dias_diferencia * -1) * 100) / parseInt(t.TARCAN)
                                eficacia = efic.toString()+"%"
                            }else{
                                var efic = 100 + ((dias_diferencia * 100) / parseInt(t.TARCAN))
                                eficacia = efic.toString()+"%"
                            }
                            //$scope.eficacia[$scope.eficacia.length] = efic.toString()+"%";
                        }else{
                            //$scope.eficacia[$scope.eficacia.length] = "Indeterminada"
                            eficacia = "Indeterminada"
                        }
                    }else{
                        eficacia = "Indeterminada"
                    }
                    var datos = {
                        _id: t._id,
                        TARDES: t.TARDES,
                        TARIMP: t.TARIMP,
                        date: t.date,
                        finish: t.finish,
                        TARCAN: t.TARCAN,
                        TARENT: t.TARENT,
                        TARSTA: t.TARSTA,
                        TARES2: t.TARES2,
                        eficacia: eficacia
                    }
                    //$scope.tareas[$scope.tareas.length] = datos;
                    $scope.tareas.push(datos);
                });*/
                /*var total_acuerdos = response.data.length;
                $("#num-notifications").html(total_acuerdos);*/
            }
        })
    }

    // función que obtiene la cantidad de acuerdos de este usuario (supervisor)
    function getNotificaciones(){
        $scope.notificaciones = [];
        var contador = 0;
        $http.get(url_server+"notificacion/listarNotif/"+$scope.usuario._id+"/"+3).success(function(response) {//para juntas (1)
            if(response.status) { // Si nos devuelve un OK la API...
                //alert("tam "+response.data.length);
                $scope.notificaciones = response.data;
                for (var i = 0 ; i < response.data.length ; i++) {
                    if(response.data[i].NOTVIS == 0){
                        contador++;
                    }
                }
                if(contador > 0){
                    if(document.getElementById('numNotif') != null){
                        document.getElementById('numNotif').setAttribute('data-badge', contador);
                        $("#ulnotif").empty();
                        //$('#notif').css('background-color', '#FF0000');
                        //$("#notif").html("<b style='color:white;font-weight:bolder;'>Nuevo+</b>");
                        $("#ulnotif").html("<li class='mdl-menu__item'><a href='notificaciones.html'><i class='fa fa-exclamation-circle'></i> <strong>Tiene nuevas notificaciones...</strong></a></li>");
                    }
                }
            }
        });
    }

    function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };

    var id = getUrlParameter('id');//id de la tarea
    // Llamamos a la función para obtener la lista de usuario al cargar la pantalla
    if (id != undefined) {
        getOneTarea();
        getComentarios();
        //getTareas();
    }

    function getComentarios(){
        $scope.comentarios = [];
        $http.get(url_server+"comentario/listarComent/"+id).success(function(response) {
            if(response.status) { // Si nos devuelve un OK la API...
                //alert("response "+response.data.length);
                $scope.comentarios = response.data;
            }
        });
    }

    // Método para obtener información de una tarea específica
    function getOneTarea() {
        //alert("tam "+$scope.tareas.length);
        $scope.bloqueado = false;
        $scope.contador = 0;
        $http.get(url_server+"tarea/find/"+id).success(function(response) {
            if(response.type) { // Si nos devuelve un OK la API...
                $scope.tarea = response.data[0];
                $scope.dependencias = []
                // Comprobamos el estado de las dependencias en caso de existir
                for (var i=0;i<$scope.tarea.dependencias.length;i++){
                    //var dep = $scope.tarea.dependencias[i]
                    $http.get(url_server+"tarea/find/"+$scope.tarea.dependencias[i]).success(function(resp) {
                        if(resp.type) { // Si nos devuelve un OK la API...
                            $scope.dependencias.push(resp.data[0]);
                            if (resp.data[0].TARSTA != 'T' ) {
                                $scope.contador++;
                                $scope.bloqueado = true;
                            }
                        }
                    });
                }
                /*$scope.estado_de_tarea = ''
                switch($scope.tarea.TARSTA){
                    case 'A': $scope.estado_de_tarea = 'Asignada'
                    break;
                    case 'P': $scope.estado_de_tarea = 'En progreso'
                    break;
                    case 'D': $scope.estado_de_tarea = 'En destiempo'
                    break;
                    case 'V': $scope.estado_de_tarea = 'Verificando'
                    break;
                    case 'T': $scope.estado_de_tarea = 'Terminado'
                    break;
                }*/
            }
        });
    }

    $scope.enviarEntregable = function() {
        //alert("entregable "+$scope.tarea.TARURL);
        var tarea = $scope.tarea
        tarea.id = tarea._id; // Pasamos la _id a id para mayor comodidad del lado del servidor a manejar el dato.
        delete tarea._id
        tarea.TARSTA = 'V';//Cambio de estatis a V (Verificando)...
        
        //tarea.TARES1 = '';//Descomentar cuando sepa yo para que es estas variables
        $http.put(url_server+"tarea/actualizar", tarea).success(function(response) {
            var dataN = {
                NOTREC: tarea.TARSUP,//Destino-Receptor...a quien va dirigido...id del supervisor, empleado, secretario....
                NOTEMI: $scope.usuario._id,//Autor-Emisor....quien le manda al destino...id del supervisor, empleado, secretario....
                NOTTIT: "Tarea realizada",//Titulo de la notificacion
                NOTAVI: "Revise la tarea "+tarea.TARCON+": "+tarea.TARDES,//Aviso...cuerpo del mensaje enviado
                NOTACT: tarea.TARACU,//id de la actividad (junta, acuerdo o tarea)...
                NOTTIP: 2,//***** (Ver si va o no)....tipo de notificaciones....(junta, acuerdo, tarea, etc....)...
                NOTFEC: now.format('YYYY-MM-DD HH:mm:ss') //Fecha de la notificacion....
            }
            $http.post(url_server+"notificacion/crearNotif", dataN).success(function(resp) {
                if(resp.status){
                    socket.emit("cambio_status", tarea.TARSUP);
                    Materialize.toast("Se ha enviado el entregable...Espere la respuesta!", 3500);
                    getOneTarea();
                    $("#new").hide();
                    $("#main").show();
                }
            });
            /*socket.emit("cambio_status", tarea.TARSUP);
            Materialize.toast("Se ha enviado el entregable...Espere la respuesta!", 3500);
            getOneTarea();
            $("#new").hide();
            $("#main").show();*/
        });
    }

    // Funcion que obtiene la diferencia de dos fechas en dias
    function restaFechas(f1,f2){
        var fecha1 = f1.split('/'); 
        var fecha2 = f2.split('/'); 
        var diferencia = Date.UTC(fecha2[2],fecha2[1]-1,fecha2[0]) - Date.UTC(fecha1[2],fecha1[1]-1,fecha1[0]);
        return Math.floor(diferencia / (1000 * 60 * 60 * 24));
    }

    socket.on("aviso_fin_tareas", function (idOperador,mensaje) {
        playBeep();
        vibrate();
        if ($scope.usuario._id == idOperador) {
            getTareas();
            getNotificaciones();
            Materialize.toast(mensaje,3560);
            
        };
    });

    socket.on("aviso_validar_tarea", function (idOp,mensaje) {
        playBeep()
        vibrate()
        if ($scope.usuario._id == idOp) {
            Materialize.toast(mensaje,3650);
            if(id != undefined){
                getComentarios();
                getOneTarea();
                getNotificaciones();
            }else{
                getTareas();
                getNotificaciones();
            }
        };
    });

    $scope.logout = function(){
        localStorage.removeItem("usuario")
        window.location.href = '../../index.html'
    }
    
    function playBeep() {
        navigator.notification.beep(1);
    }

    // Vibrate for 2 seconds
    function vibrate() {
        navigator.notification.vibrate(2000);
    }

}]);