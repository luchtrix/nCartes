var app = angular.module('secreto', []);
//var url_server = 'http://192.168.0.104:3001/';
var url_server = 'http://192.168.0.32:3001/';
var socket = io.connect(url_server);

$(document).ready(function (){
    /*alert("cargado...");
    var alerticon = document.getElementById('numNotif');
    alerticon.setAttribute('data-badge', 10);*/
    $("#new").hide();
    $("#dependencias").hide();
    $("#confirmT").hide();
    $("#task").hide();
    $("#accept").hide();
    $("#notaccept").hide();
    $("#finish").hide();
    //probando el objeto moment
    /*var now = moment();
    var time1 = now.format('YYYY-MM-DD h:mm:ss a');//
    var time2 = now.add('hours',28).format('YYYY-MM-DD h:mm:ss a');//
    alert("time1 -> "+time1);
    alert("time 2 -> "+time2);
    //var input = moment($("#myinput").val(), "YYYY/MM/DD HH:mm:ss");
    if(time1 > time2){
        alert("time1 > time2");
    }else{
        alert("time1 < time2");
    }*/
});

app.controller('supervisorCtrl', ['$scope', '$http', function($scope, $http){
    //----------------------------------------------------
    var now = moment();//instanciando el objeto moment
    var usuario = localStorage.getItem("usuario")///----------------------------------nuevo|
    $scope.usuario = JSON.parse(usuario);// toda la informacion acerca del usuario
    var empresa = $scope.usuario.EMPIDC;//id de la empresa a la que esta relacionado       |
    $scope.dependenciesT = [];

    getAcuerdos();
    getInvitJuntas();
    getJuntas();
    getEmpleados();
    getNotificaciones();

    // función que obtiene la cantidad de acuerdos de este usuario (supervisor)
    function getNotificaciones(){
        $scope.notificaciones = [];
        var contador = 0;
        $http.get(url_server+"notificacion/listarNotif/"+$scope.usuario._id+"/"+1).success(function(response) {//para juntas (1)
            if(response.status) { // Si nos devuelve un OK la API...
                //alert("tam "+response.data.length);
                //$scope.notificaciones = response.data;
                for (var i = 0 ; i < response.data.length ; i++) {
                    if(response.data[i].NOTVIS == 0){
                        contador++;
                    }
                    $scope.notificaciones.push(response.data[i]);
                }
                if(contador > 0){
                    if(document.getElementById('numNotif')!= null){
                        document.getElementById('numNotif').setAttribute('data-badge', contador);
                        $("#ulnotif").empty();
                        //$('#notif').css('background-color', '#FF0000');
                        //$("#notif").html("<b style='color:white;font-weight:bolder;'>Nuevo+</b>");
                        $("#ulnotif").html("<li class='mdl-menu__item'><a href='notificaciones.html'><i class='fa fa-exclamation-circle'></i> <strong>Tiene nuevas notificaciones...</strong></a></li>");
                    }
                }
            }
        });

        $http.get(url_server+"notificacion/listarNotif/"+$scope.usuario._id+"/"+2).success(function(response) {//para juntas (1)
            if(response.status) { // Si nos devuelve un OK la API...
                for (var i = 0 ; i < response.data.length ; i++) {
                    if(response.data[i].NOTVIS == 0){
                        contador++;
                    }
                    $scope.notificaciones.push(response.data[i]);
                }
                if(contador > 0){
                    if(document.getElementById('numNotif')!= null){
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

    // función que obtiene la cantidad de acuerdos de este usuario (supervisor)
    function getAcuerdos(){
        $scope.acuerdos = [];
        $http.get(url_server+"acuerdo/buscar/"+$scope.usuario._id).success(function(response) {
            if(response.type) { // Si nos devuelve un OK la API...
                //alert("tam "+response.data.length);
                for ( var i = 0 ; i < response.data.length ; i++ ) {
                    if(response.data[i].ACUSTA != ''){
                        $scope.acuerdos.push(response.data[i]);
                    }
                }
                //$scope.acuerdos = response.data;
                //total_juntas();
            }
        });
    }

    //funcion que obtiene todas las juntas a las que ha sido invitado este supervisor
    function getInvitJuntas(){
        //$scope.juntas = [];
        $http.get(url_server+"invit/findInvitados/"+$scope.usuario._id).success(function(response) {
            if(response.status == 'OK') { // Si nos devuelve un OK la API...
                $scope.invitJuntas = response.data;
                /*$("#none_juntas").remove()
                $("#ver_todas_juntas").remove()*/
                //$(".lista_de_juntas").append('<li class="mdl-menu__item" ><a href="junta.html?id='+response.data.INVJUN+'"> '+response.data.INVJNO+' <br> <span>'+response.data.INVFEC+' a las '+response.data.INVHOR+'hrs.</span></a></li>')
                /*$(".lista_de_juntas").append('<li id="none_juntas" class="mdl-menu__item" ng-if="juntas.length == 0">No tienes juntas asignadas</li>');
                $(".lista_de_juntas").append('<li id="ver_todas_juntas" class="mdl-menu__item all" ng-if="juntas.length > 0"><a href="juntas.html">Ver todas</a></li>');*/
            }
        });
    }

    function getJuntas() {
        $scope.juntas = [];
        $http.get(url_server+"junta/listar/"+empresa).success(function(response) {
            if(response.status == "OK") {
                $scope.juntas = response.data;
                /*for (var i = 0 ; i < response.data.length ; i++) {
                    if(response.data[i].JUNIDE == $scope.usuario._id){
                        $scope.juntas.push(response.data[i]);
                    }
                }*/
            }
        })
    }

    function getEmpleados(){
        $http.get(url_server+"user/usuario/3/"+empresa).success(function(response) {
            if(response.type) { // Si nos devuelve un OK la API...
                $scope.empleados = response.data;
            }
        });
    }

    /*$scope.viewForm = function(){
        console.log("aaa");
        $("#new").show();
        $("#main").hide();                    
    }

    $scope.hideForm = function(){
        $("#new").hide();
        $("#main").show();
    }*/
    /*$("#showForm").click(function(){
        alert("asdasdas");
        $("#new").show();
        $("#main").hide();
    });
    */
    $("#hideForm").click(function(){
        $("#new").hide();
        $("#main").show();
    });

    $("#showDep").click(function(){
        $("#dependencias").show();
        $("#new").hide();
    });

    $("#hideDep").click(function(){
        $("#dependencias").hide();
        $("#new").show();
    });

    $("#hideTask").click(function(){
        $scope.task = [];
        $("#task").hide();
        $("#main").show();
    });

    $("#hideAccept").click(function(){
        $("#accept").hide();
        $("#task").show();
    });

    $("#hideNotaccept").click(function(){
        $("#notaccept").hide();
        $("#task").show();
    });

    $("#hideFinish").click(function(){
        $("#finish").hide();
        $("#main").show();
    });

    $scope.viewTarea = function(data){
        $scope.task = data;
        $("#main").hide(); 
        $("#task").show();
    }

    $scope.viewForm = function(){
        console.log("viewForm");
        $("#new").show();
        $("#main").hide();
    }

    $scope.showConfirmT = function(){
        $("#confirmT").show();
        $("#main").hide(); 
    }

    $scope.hideConfirmT = function(){
        $("#main").show();
        $("#confirmT").hide(); 
    }    

    $scope.accept = function(){
        $("#accept").show();
        $("#task").hide(); 
    }

    $scope.notaccept = function(){
        $("#notaccept").show();
        $("#task").hide(); 
    }

    $scope.finalizar = function(){
        $("#finish").show();
        $("#main").hide(); 
    }

    $scope.dependencies = function(idT){
        //alert($scope.junta.JUNNUM);
        //return;
        var contador = 0;
        var bandera = 0;
        for (var i = 0 ; i < $scope.dependenciesT.length ; i++) {
            if($scope.dependenciesT[i] == idT){
                bandera = 1;
                $scope.dependenciesT.splice(i,1);
            }else{
                contador++;
            }
        }
        if(bandera == 0 && (contador == $scope.dependenciesT.length)){
            $scope.dependenciesT.push(idT);
        }
    }

    $scope.nuevaTarea = function(){
        //alert("acuerdo "+$scope.acuerdo._id+" tarea "+$scope.tareaN.TARDES);
        /*if($scope.tarea.TARRES == undefined){
            $("#error").append("<div class='alert alert-danger'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><i class='fa fa-user'></i> Para continuar, Seleccione un Empleado para esta tarea</div>");
            return;
        }*/
        $scope.tareaN.TARIDC = empresa;
        $scope.tareaN.TARACU = $scope.acuerdo._id;
        $scope.tareaN.TARJUN = $scope.acuerdo.ACUJUN;
        $scope.tareaN.TARPUN = $scope.acuerdo.ACUPUN;
        $scope.tareaN.TARSUP = $scope.usuario._id;
        $scope.tareaN.TARCON = ($scope.tareas.length + 1)
        //$scope.tarea.TARHRE = 0
        //$scope.tarea.TARREA = 0
        //$scope.tarea.TARES1 = ''
        //$scope.tarea.TARES2 = ''
        $scope.tareaN.TARSTA = '';
        $scope.tareaN.TARURL = ''
        $scope.tareaN.dependencias = $scope.dependenciesT;
        //$scope.tarea.dependencias_des = $scope.checkedDependencias;
        $scope.tareaN.date = now.format('YYYY-MM-DD h:mm:ss a');//la fecha y hora en que se da de alta la tarea....
        $scope.tareaN.finish = now.add('hours',$scope.tareaN.TARCAN).format('YYYY-MM-DD h:mm:ss a');//el momento (fecha y hora en la que se debe de entregar la tarea...se le suman las horas que se le dieron a la tarea);

        $http.post(url_server+"tarea/crear", $scope.tareaN).success(function(response) {
            if(response.status === "OK") { // Si nos devuelve un OK la API...
                //socket.emit("nueva_tarea", response.data);
                Materialize.toast("Tarea Creada!", 3500);
                $scope.tareaN = {}; // Limpiamos el scope
                getOneAcuerdo();
                getTareas();
                $("#new").hide();
                $("#main").show(); 
            }
        });
    }

    $scope.enviarTareas = function(){
        //alert("tam tareas "+$scope.tareas.length);
        //return;
        var idsEmpleados = [];
        for(var i = 0 ; i < $scope.tareas.length ; i++){
            if(i == 0){
                idsEmpleados.push($scope.tareas[i].TARRES);
            }else{
                var index = 0;
                index = idsEmpleados.indexOf($scope.tareas[i].TARRES);
                if(index < 0){
                    //alert("No esta ese wey en el arreglo")
                    idsEmpleados.push($scope.tareas[i].TARRES);
                }
            }
            var dataN = {
                NOTREC: $scope.tareas[i].TARRES,//Destino-Receptor...a quien va dirigido...id del supervisor, empleado, secretario....
                NOTEMI: $scope.usuario._id,//Autor-Emisor....quien le manda al destino...id del supervisor, empleado, secretario....
                NOTTIT: "Nueva Tarea",//Titulo de la notificacion
                NOTAVI: "Se le asigno la Tarea "+$scope.tareas[i].TARCON+": "+$scope.tareas[i].TARDES,//Aviso...cuerpo del mensaje enviado
                NOTACT: $scope.tareas[i]._id,//id de la actividad (junta, acuerdo o tarea)...
                NOTTIP: 3,//***** (Ver si va o no)....tipo de notificaciones....(junta, acuerdo, tarea, etc....)...
                NOTFEC: now.format('YYYY-MM-DD HH:mm:ss') //Fecha de la notificacion....
            }
            $http.post(url_server+"notificacion/crearNotif", dataN).success(function(resp) {
                if(resp.status){
                    console.log("Guardado con exito 2");    
                }
            });
        }
        
        for(var i in $scope.tareas){
            $http.get(url_server+'tarea/actualizarStatus', { params : {tarea: $scope.tareas[i]._id, status:'A'}}).success(function(datos){//A ---> Acordado --- cafe
                if(datos.type){
                    console.log("tarea actualizada para que se visualize en la vista del op");
                }else{
                    console.log("No actualizada");
                }
            });
        }

        //alert("idsEmpleados "+idsEmpleados);
        for( var i = 0 ; i < idsEmpleados.length ; i++ ){
            socket.emit("aviso_fin_tareas", idsEmpleados[i], "Tiene nuevas tareas!");
        }

        //alert("finish");
        $http.get(url_server+'acuerdo/actualizarStatus', { params : {acuerdo: id, status:'P'}}).success(function(datos){//A ---> Acordado --- cafe
            if(datos.type){
                Materialize.toast("Has Terminado de asignar Tareas!", 3500);
                getOneAcuerdo();
                getTareas();
                $("#confirmT").hide();
                $("#main").show(); 
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

    var id = getUrlParameter('id');//id del acuerdo
    var idj = getUrlParameter('idj');//id de la junta
    // Llamamos a la función para obtener la lista de usuario al cargar la pantalla
    
    if (id != undefined) {
        //alert("es undefined")
        getOneAcuerdo();
        getTareas();
        //total_acuerdos();
        getEmpleados();
    }/*else{
        total_acuerdos();
        getAcuerdoUnico();
        getEmpleados();
    }*/
    if(idj != undefined){
        getJuntaUnica();
        getOrdenByJunta();
    }

    function getOneAcuerdo(){
        //alert("getOneAcuerdo");
        $http.get(url_server+"acuerdo/find/"+id).success(function(response) {
            if(response.type) { // Si nos devuelve un OK la API...
                $scope.acuerdo = response.data[0];
                //Se tiene 4 estados: A(Asignado),P(En progreso),D(Destiempo) y T(Terminado)
                today = get_today()
                var dias_diferencias = restaFechas(today, response.data[0].ACUTIM)
                if (dias_diferencias == 0) {
                    $scope.limiteT = "Hoy es el día límite para cumplir con este acuerdo."
                }else if (dias_diferencias == 1) {
                    $scope.limiteT = "Mañana es el día límite para cumplir con este acuerdo."
                }else if (dias_diferencias > 0) {
                    $scope.limiteT = "Faltan "+dias_diferencias+" días para cumplir con este acuerdo."
                }else if (dias_diferencias < 0) {
                    $scope.limiteT = "La fecha límite para cumplir con este acuerdo fue hace "+Math.abs(dias_diferencias)+" días"
                };
                //getTareas($scope.acuerdo._id);
            }
        });
    }
    
    function getTareas(){
        $scope.finalizado = false;
        var contador = 0;
         //alert("getTareas");
        //$scope.bloqueado = "true";
        //$scope.tarea.TARIDC = empresa;
        $http.get(url_server+"tarea/listar/"+id+"/"+empresa).success(function(response) {
            if(response.status === "OK") { // Si nos devuelve un OK la API...
                $scope.tareas = response.data;
                for (var i = 0; i < response.data.length ; i++) {
                    if(response.data[i].TARSTA == 'T'){//Si estan terminados....
                        contador++;
                    }
                }
                if (contador == response.data.length && response.data.length > 0) {
                    $scope.finalizado = true;
                }
                /*for (var i=0;i<$scope.tareas.length;i++){
                    var dep = $scope.tareas[i].TARSTA;
                    if ((dep != 'T') ) {
                        $scope.bloqueado = "false";
                    };
                }*/
            }
        });
    }

    //$scope.validarTarea = function(tarea_validar){
    $scope.validarTarea = function(indicador){
        var mensaje = "";
        var observaciones = "";
        if(indicador == 1){
            if ($("#observacionesa").val()=="") {
                Materialize.toast("Agregue un comentario...!",3650);
                return;
            }
            observaciones = $("#observacionesa").val();
            $scope.task.TARSTA = 'T';
            //tarea.TARSTA = 'T';//Terminado...validado...aceptado
            //mensaje = "Se ha validado la tarea: "+tarea.TARDES;
            mensaje = "Se Validó una tarea...!";
        }else{
            if ($("#observacionesn").val()=="") {
                Materialize.toast("Agregue el motivo del rechazo...!",3650);
                return;
            }
            observaciones = $("#observacionesn").val();
            $scope.task.TARSTA = 'R';
            //tarea.TARSTA = 'R';//No terminado...rechazado
            //mensaje = "Se ha rechazado la tarea: "+tarea.TARDES+". Vuelva a enviarlo.";
            mensaje = "Se Rechazó una tarea...!";
        }

        var tarea = $scope.task;
        tarea.id = tarea._id; // Pasamos la _id a id para mayor comodidad del lado del servidor a manejar el dato.
        delete tarea._id;
        
        //tarea.TARSTA = 'T';
        //tarea.TARES2 = get_today()
        $http.put(url_server+"tarea/actualizar", tarea).success(function(response) {
            if(response.status == "OK"){
                var dataC = {
                    COMIDT: tarea.id,//id de la tarea
                    COMCON: observaciones,//contenido del comentario
                    COMFEC: now.format('YYYY-MM-DD HH:mm:ss') //Fecha del comentario....
                };
                $http.post(url_server+"comentario/crearComent", dataC).success(function(resp){
                    if (resp.status) {

                        var dataN = {
                            NOTREC: tarea.TARRES,//Destino-Receptor...a quien va dirigido...id del supervisor, empleado, secretario....
                            NOTEMI: $scope.usuario._id,//Autor-Emisor....quien le manda al destino...id del supervisor, empleado, secretario....
                            NOTTIT: "Tarea Rechazada",//Titulo de la notificacion
                            NOTAVI: "Se rechazó la Tarea "+tarea.TARCON+": "+tarea.TARDES,//Aviso...cuerpo del mensaje enviado
                            NOTACT: tarea.id,//id de la actividad (junta, acuerdo o tarea)...
                            NOTTIP: 3,//***** (Ver si va o no)....tipo de notificaciones....(junta, acuerdo, tarea, etc....)...
                            NOTFEC: now.format('YYYY-MM-DD HH:mm:ss') //Fecha de la notificacion....
                        }
                        $http.post(url_server+"notificacion/crearNotif", dataN).success(function(resp) {
                            if(resp.status){
                                socket.emit("aviso_validar_tarea", tarea.TARRES, mensaje);
                                if(indicador == 1){
                                    Materialize.toast("Has validado esta tarea",3650);
                                    $("#accept").hide();
                                    $("#main").show();
                                }else{
                                    Materialize.toast("Has rechazado esta tarea, esperando...",3650);
                                    $("#notaccept").hide();
                                    $("#main").show();
                                }
                                getOneAcuerdo();
                                getTareas();
                            }
                        });
                    }    
                });
            }
        })
    }

    // Método para obtener información de una junta específica
    function getJuntaUnica() {
        //$scope.bloqueado = false;
        $http.get(url_server+"junta/find/"+idj).success(function(response) {
            if(response.type) { // Si nos devuelve un OK la API...
                $scope.junta = response.data[0];
                $scope.diasR = restaFechas(get_today(),$scope.junta.JUNFEC);
            }
        });
    }

    function getOrdenByJunta() {
        //para obtener toda la orden del dia (todos los puntos de la orden del dia) de una junta
        $http.get(url_server+"orden/byJunta/"+idj).success(function(response) {
            if (response.status == "OK") {
                $scope.listOrden = response.data;
                //getAcuerdosForOrden(response.data);
            }
        })
    }

    $scope.terminarAcuerdo = function(){
        //alert("fecha asignada "+$scope.acuerdo.ACUTIM+" fecha de finalización del acuerdo "+get_today())
        /*if($("#observacionesf").val()){
            Materialize.toast("Agregue un comentario!",3650);
            return;
        }*/

        if(get_today() > $scope.acuerdo.ACUTIM){
            //alert("aa-->Terminado En destiempo");
            $scope.acuerdo.ACUSTA = "R";//Se retrasoo...
            //$scope.acuerdo.ACUOBS = $("#observacionesf").val();//Se retrasoo...
        }else{
            //alert("bb-->Terminado En tiempo")
            $scope.acuerdo.ACUSTA = "T";
            //$scope.acuerdo.ACUOBS = $("#observacionesf").val();//Se retrasoo...
        }

        $http.get(url_server+"junta/find/"+$scope.acuerdo.ACUJUN).success(function(response) {
            if(response.type){
                //alert("response "+response.data[0].JUNIDE)
                var idSec = response.data[0].JUNIDE;
                var acuerdo = $scope.acuerdo;
                acuerdo.id = acuerdo._id; // Pasamos la _id a id para mayor comodidad del lado del servidor a manejar el dato.
                delete acuerdo._id; // Lo borramos para evitar posibles intentos de modificación de un ID en la base de datos
                // Hacemos una petición PUT para hacer el update a un documento de la base de datos.
                $http.put(url_server+"acuerdo/actualizar", acuerdo).success(function(resp) {
                    if(resp.status === "OK") {
                        var dataN = {
                            NOTREC: idSec,//Destino-Receptor...a quien va dirigido...id del supervisor, empleado, secretario....
                            NOTEMI: $scope.usuario._id,//Autor-Emisor....quien le manda al destino...id del supervisor, empleado, secretario....
                            NOTTIT: "Acuerdo Finalizado",//Titulo de la notificacion
                            NOTAVI: "Se finalizó el Acuerdo "+acuerdo.ACUCON+": "+acuerdo.ACUDES,//Aviso...cuerpo del mensaje enviado
                            NOTACT: acuerdo.ACUJUN,//id de la actividad (junta, acuerdo o tarea)...
                            NOTTIP: 2,//***** (Ver si va o no)....tipo de notificaciones....(junta, acuerdo, tarea, etc....)...
                            NOTFEC: now.format('YYYY-MM-DD HH:mm:ss') //Fecha de la notificacion....
                        }
                        $http.post(url_server+"notificacion/crearNotif", dataN).success(function(r) {
                            if(r.status){
                                socket.emit("fin_acuerdo",idSec);
                                Materialize.toast("Buen trabajo, has terminado el acuerdo!",3650);
                                getOneAcuerdo();
                                getTareas();
                                $("#finish").hide();
                                $("#main").show();
                            }
                        });
                    }
                });
            }
        });
    }
    
    function get_today(){
        // Obtenemos la fecha de hoy con el formato dd/mm/yyyy
        var today = new Date()
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd
        } 
        if(mm<10){
            mm='0'+mm
        } 
        var today = dd+'/'+mm+'/'+yyyy;
        return today;
    }

    // Funcion que obtiene la diferencia de dos fechas en dias
    function restaFechas(f1,f2){
        var fecha1 = f1.split('/'); 
        var fecha2 = f2.split('/'); 
        var diferencia = Date.UTC(fecha2[2],fecha2[1]-1,fecha2[0]) - Date.UTC(fecha1[2],fecha1[1]-1,fecha1[0]);
        return Math.floor(diferencia / (1000 * 60 * 60 * 24));
    }

    $scope.logout = function(){
        localStorage.removeItem("usuario")
        window.location.href = '../../index.html'
    }
    
    //Para recibir el aviso de una nueva junta
    // Funcion de escucha ante una nueva junta
    socket.on("nueva_junta", function (idj, motivo, id) {
        //alert("idj "+idj+" motivo "+motivo+" id "+id);
        if ($scope.usuario._id == id) {
            playBeep();
            vibrate();
            getInvitJuntas();
            getJuntas();
            getNotificaciones();
            Materialize.toast("Nueva Junta de Trabajo!", 3500);
        };
    });

    socket.on("nuevo_acuerdo", function (data) {
        if ($scope.usuario._id == data) {
            playBeep()
            vibrate()
            //total_acuerdos()
            getAcuerdos();
            getNotificaciones();
            Materialize.toast("Nuevo Acuerdo Asignado",3650);
        };
    });

    socket.on("cambio_status", function (idS) {
        playBeep()
        vibrate()
        if($scope.usuario._id == idS){
            if(id != undefined){
                getNotificaciones();
                getOneAcuerdo();
                getTareas();
            }else{
                getNotificaciones();
            }/*else{
                getAcuerdos();
                getJuntas();
                getEmpleados();
            }*/
            Materialize.toast("Se ha modificado el estado de una tarea",3650);
        }
    });

    socket.on("cancel_junta", function (idj, clave, id) {
        //var myName = $scope.usuario._id;
        if ($scope.usuario._id == id) {
            playBeep()
            vibrate()
            //getAcuerdos(); 
            getJuntas();
            getNotificaciones();
            Materialize.toast("Se canceló una Junta!",3650)
        };
    });

    /*socket.on("pruebaCron",function(){
        alert("pruebaCron");
    });*/

    function playBeep() {
        navigator.notification.beep(1);
    }

    // Vibrate for 2 seconds
    function vibrate() {
        navigator.notification.vibrate(2000);
    }

}]);