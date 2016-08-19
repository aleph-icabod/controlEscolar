//Meteor.subscribe('users');	
Session.set('area','');
Session.set('cursoSeleccionado','');
Session.set("cursoTomado","");

Template.alumnoNuevo.events({
"submit #alumnoNuevo":function(event){
	event.preventDefault();
	var nombre=$("#nombre").val();
	var apPat=$("#apPat").val();
	var apMat=$("#apMat").val();
	var domicilio=$("#direccion").val();
	var telefono=$("#telefono").val();
	var email=$("#email").val();
	var escolaridad=$("#escolaridad").val();
	var sexo=$("[name=sexo]:checked").val();
	var numControl=generarNumControl();
	var nip=generaNip();
	nip=""+nip;
	var alumno={
		numControl:numControl,
		nombre:nombre,
		apPat:apPat,
		apMat:apMat,
		domicilio:domicilio,
		telefono:telefono,
		email:email,
		escolaridad:escolaridad,
		sexo:sexo,
		nip:nip
	};	
	Meteor.call("addAlumno",alumno,function(error,result){
		if(error)
			alerta("Error al crear "+error,"error","3000");
		else{
			alerta("El alumno con numero de control "+alumno.numControl+
				" <br> Nip "+alumno.nip+" se ha creado correctamente","hecho","3000");
			document.getElementById("alumnoNuevo").reset();	
			}});
},
"click #cancelar":function(event){
	event.preventDefault();
	document.getElementById("alumnoNuevo").reset();
}
});

Template.editarAlumno.events({
"change .js-listaAlumno":function(event){
	event.preventDefault();
	var nc;
	if(event.currentTarget.id=="nombreAlumno")
	 nc=parseInt($("#nombreAlumno").val());
	else
	 nc=parseInt($("#numControl").val());
	var current=Alumnos.findOne({numControl:nc});
	if(current){
		console.log(current.sexo);
		$("#nip").val(current.nip);
		$("#direccion").val(current.domicilio);
		$("#telefono").val(current.telefono);
		$("#email").val(current.email);
		$("#escolaridad").val(current.escolaridad);
		$("input:checked").prop("checked",false);
		$("input[value="+current.sexo+"]").prop("checked",true);		
		$("#nombreAlumno").val(current.numControl);
		$("#numControl").val(current.numControl);
		$("#nuevoNombre").val(current.nombre);
		$("#nuevoApPat").val(current.apPat);
		$("#nuevoApMat").val(current.apMat);
	}else
		document.getElementById("editarAlumno").reset();
},
"submit #editarAlumno":function(event){
	event.preventDefault();
	var id=parseInt($("#numControl").val());
	if(id){
	id=Alumnos.findOne({numControl:id})._id;
	var alumno={
 		domicilio:$("#direccion").val(),
		sexo:$("[name=sexo]:checked").val(),
		telefono:$("#telefono").val(),
		email:$("#email").val(),
		nombre:$("#nuevoNombre").val(),
		escolaridad:$("#escolaridad").val(),
		apPat:$("#nuevoApPat").val(),
		apMat:$("#nuevoApMat").val()};
	Meteor.call("actualizaAlumno",alumno,id,function(error,result){
		if(error)
			alerta("Ha ocurrido un error al tratar de actualizar "+error,"error","3000");
		else{
			alerta("cambios guardados con exito","hecho","3000");
			document.getElementById("editarAlumno").reset();
			}});	}
	else{ 	
		alerta("No ha seleccionado un alumno","error","3000");
		document.getElementById("editarAlumno").reset();}
},
"click #cancelar":function(event){
	event.preventDefault();
	document.getElementById("editarAlumno").reset();	
}
});


Template.maestroNuevo.events({
"submit #maestroNuevo":function(event){
	event.preventDefault();	
	var nombre=$("#nombre").val();
	var apPat=$("#apPat").val();
	var apMat=$("#apMat").val();
	var especialidad=$("#especialidad").val();
	var rfc=$("#rfc").val().toUpperCase();
	var domicilio=$("#direccion").val();
	var telefono=$("#telefono").val();
	var email=$("#email").val();
	var Nip=generaNip();
	Nip=""+Nip;
	var usuario=numControlMaestro();
	var maestro={
		nombre:nombre,
		apPat:apPat,
		apMat:apMat,
		numControl:usuario,
		rfc:rfc,
		especialidad:especialidad,
		domicilio:domicilio,
		telefono:telefono,
		email:email,
		nip:Nip} 
	Meteor.call("addMaestro",maestro,function(error,result){
		if(error)
			alerta("Error al crear nuevo maestro "+error,"error","3000");
		else{
			alerta("Se ha creado el maestro <br> Nombre de usuario: "+maestro.numControl+
				"<br>Nip: "+maestro.nip,"hecho","3000");
			document.getElementById("maestroNuevo").reset();
		}});
},
"click #cancelar":function(event){
		event.preventDefault()
		document.getElementById("maestroNuevo").reset();
},
"focus #rfc":function(event){
	var ap=$("#apPat").val();
	var am=$("#apMat").val();
	var n=$("#nombre").val();
	$("#rfc").val(ap.substr(0,2)+am.substr(0,1)+n.substr(0,1))
}
});

Template.editarMaestro.events({
"change .js-listaMaestro":function(event){
	event.preventDefault();
	var nc;
	if(event.target.id=="usuario")
		nc=$("#usuario").val();
	else 
		nc=$("#nombreMaestro").val();	
	var current=Maestros.findOne({numControl:nc})
	if(current){
		$("#nombre").val(current.nombre);
		$("#nip").val(current.nip)
		$("#especialidad").val(current.especialidad)
		$("#rfc").val(current.rfc)
		$("#telefono").val(current.telefono)
		$("#email").val(current.email)
		$("#direccion").val(current.domicilio)
		$("#usuario").val(current.numControl)
		$("#nombreMaestro").val(current.numControl)
		$("#apPat").val(current.apPat)
		$("#apMat").val(current.apMat)
	}
	else
		document.getElementById("editarMaestro").reset();
},
"submit #editarMaestro":function(event){
	event.preventDefault();
	var id=$("#usuario").val();
 	var maestro={
 		nombre:$("#nombre").val(),	
 		especialidad:$("#especialidad").val(),
 		rfc:$("#rfc").val(),
 		telefono:$("#telefono").val(),
 		email:$("#email").val(),
 		direccion:$("#direccion").val(),
 		id:$("#usuario").val(),
 		apPat:$("#apPat").val(),
 		apMat:$("#apMat").val()};
	if(id){
		id=Maestros.findOne({numControl:id})._id;
		Meteor.call("actualizarMaestro",maestro,id,function(error){
			if(error)
				alerta("Error al actualizar "+error,"error","3000");
			else{
				alerta("Cambios guardados","hecho","1500")
				document.getElementById("editarMaestro").reset();
				}});		
	}else
	 alerta("Seleccione un maestro","error","2500");	
},
"click #cancelar":function(event){
	event.preventDefault();
	document.getElementById("editarMaestro").reset();
},
"focus #rfc":function(event){
	var ap=$("#apPat").val();
	var am=$("#apMat").val();
	var n=$("#nombre").val();
	console.log(ap.substr(0,2)+am.substr(0,1)+n.substr(0,1))
}
});


Template.cursoNuevo.events({
"change #area":function(event){
	event.preventDefault();
	var a=$("#area").val();
	Session.set("area",a);
},
"submit #cursoNuevo":function(event){
	event.preventDefault();
	var materia=$("#materia").val();
	var area=$("#area").val();
	var maestro=$("#maestro").val();
	var nivel=$("#nivel").val();
	var cupo=parseInt($("#cupo").val());
	var horaInicio=$("#hora-inicio").val();
	var horafin=$("#hora-fin").val();
	var numCurso=generaNumCurso();
	var costo=parseInt($("#costo").val());
	var desc=$("#descripcion").val();
	var curso={
		numCurso:numCurso,
		materia:materia,
		area:area,
		maestro:maestro,
		nivel:nivel,
		cupo:cupo,
		cupoDisponible:cupo,
		horaInicio:horaInicio,
		horafin:horafin,
		costo:costo,
		descripcion:desc
	}		
	Meteor.call("addCurso",curso,function(error,resut){
		if(error)
			alerta("Error al intentar abrir el curso "+error.details);
		else{
			alerta("Nuevo curso abierto con id "+curso.numCurso,"hecho","2000");			
			document.getElementById("cursoNuevo").reset();
		}
	});		
},
"click #cancelar":function(event){
	event.preventDefault();
	Session.set("area",'');
	document.getElementById("cursoNuevo").reset();	
}
})

Template.editarCurso.events({
"change #materia":function(event){
	event.preventDefault();
	var numCurso=parseInt($("#materia").val());		
	numCurso=Materias.findOne({numCurso:numCurso});			
	if(numCurso){			
		$("#area").val(numCurso.area);
		$("#maestro").val(numCurso.maestro);
		$("#nivel").val(numCurso.nivel);
		$("#cupo").val(numCurso.cupo);
		$("#hora-inicio").val(numCurso.horaInicio);
		$("#hora-fin").val(numCurso.horafin);
		$("#nombre").val(numCurso.materia)
		$("#costo").val(numCurso.costo);
		$("#cupoDisponible").val(numCurso.cupoDisponible);
		$("#descripcion").val(numCurso.descripcion);
	}else
		document.getElementById("editarCurso").reset();
},
"change #cupo":function(event){	
	event.preventDefault();
	var numCurso=parseInt($("#materia").val());		
	numCurso=Materias.findOne({numCurso:numCurso});		
	if(numCurso){
		var cupoActual=numCurso.cupo;
		var disponibleActual=numCurso.cupoDisponible;
		if(!disponibleActual)
			disponibleActual=cupoActual;
		var nuevoCupo=parseInt($("#cupo").val());
		var aux=nuevoCupo-cupoActual;
		$("#cupoDisponible").val(disponibleActual+aux);	
		if(nuevoCupo<(cupoActual-disponibleActual)){
			$("#cupo").val(cupoActual-disponibleActual);
			$("#cupoDisponible").val(0);	
		}		
	}
},
"submit #editarCurso":function(event){
	event.preventDefault();
	var curso={
	 materia:$("#nombre").val(),
	 area:$("#area").val(),
	 maestro:$("#maestro").val(),		
	 nivel:$("#nivel").val(),
	 cupo:parseInt($("#cupo").val()),
	 horaInicio:$("#hora-inicio").val(),
	 horafin:$("#hora-fin").val(),		
	 costo:parseInt($("#costo").val()),
	 cupoDisponible:parseInt($("#cupoDisponible").val()),
	 descripcion:$("#descripcion").val()
	};

	var auxiliar=Maestros.findOne({numControl:curso.maestro}).especialidad;		
	if(auxiliar==curso.area){
		var id=Materias.findOne({numCurso:parseInt($("#materia").val())})._id
		Meteor.call("actualizarCurso",curso,id,function(error){
			if(error)
				alerta("Error de actualizacion "+error,"error","3000");
			else
				alerta("Cambios guardados con exito","hecho","2000");			
				document.getElementById("editarCurso").reset();		
		});		
	}else{
		alerta("El profesor elegido no corresponde al area de la materia,"+ 
			" seleccionar uno diferente","error","3000");
	}		
},
"click #cancelar":function(event){
	event.preventDefault();
	document.getElementById("editarCurso").reset();
}		
});

Template.alumnoCurso.events({
"change #nivel":function(event){
	var x=$("#nivel").val();	
	Session.set("nivelCursos",x);
	console.log(x);
},

"change #curso":function(event){
	event.preventDefault();
	var aux=parseInt($("#curso").val())
	if(aux){
	var cursoCurrent=Materias.findOne({numCurso:aux})
	$("#horario").val(cursoCurrent.horaInicio+" - "+cursoCurrent.horafin);
	$("#nivel").val(cursoCurrent.nivel);
	aux=Maestros.findOne({numControl:cursoCurrent.maestro}).nombre
	$("#maestro").val(aux+" "+Maestros.findOne({numControl:cursoCurrent.maestro}).apPat+" "+Maestros.findOne({numControl:cursoCurrent.maestro}).apMat);
	$("#cupo").val(cursoCurrent.cupoDisponible);}
	else{
		document.getElementById("alumnoCurso").reset();
	}
},
"submit #alumnoCurso":function(event){
	event.preventDefault();
	var alumno=$("#alumno").val();
	var curso=parseInt($("#curso").val());
	var pago=$("#pago").val();
	if(alumno!=''){
	  var al=CursoAlumno.find({curso:curso,alumno:alumno}).fetch();			
	  if(al.length<=0){
		var alumnoCurso={
			alumno:alumno,
			curso:curso,
			pago:pago,
			fechaInscripcion:new Date(),
			calificacion:0
		};

		var cursoId=Materias.findOne({numCurso:curso})
		if(cursoId.cupoDisponible>0){	
			Meteor.call("inscribirAlumno",alumnoCurso,cursoId._id,function(error,result){
				if(error)
					alerta("Error "+error.details,"error","3000");
				else
					alerta("El alumno "+Alumnos.findOne({numControl:parseInt(alumnoCurso.alumno)}).nombre+" se ha agregado"+
					" al curso "+Materias.findOne({numCurso:alumnoCurso.curso}).materia,"hecho","3000");
			});			
			document.getElementById("alumnoCurso").reset();	}
		else
			alerta("El curso esta lleno no se puede agregar mas alumnos","error","2000");		
	  }
	   else{alerta("El alumno "+Alumnos.findOne({numControl:parseInt(alumno)}).nombre+" ya se encuentra"+
		" inscrito en ese curso ","error","3000");}
	}else{
		alerta("No ha seleccionado ningun alumno","error","none");
	}
},
"click #cancelar":function(event){
document.getElementById("alumnoCurso").reset();	
}	
})


Template.alumnosXcurso.events({
"change #cursos":function(event){
	event.preventDefault();
	var a=$("#cursos").val();		
	Session.set("cursoSeleccionado",a);
}
})

Template.login.events({
"focus input":function(event){
	var w=event.target.name;
	console.log(w)
	$("input").removeClass("incorrect");
	//$("#"+).removeClass("incorrect");
},	
"submit .ingresar":function(event){
event.preventDefault();

var username=$("[name=usuario]").val();
var password=$("[name=password]").val();
Meteor.loginWithPassword(username,password,function(error){
	if(error){		
		$("[name=usuario]").addClass("incorrect");
		$("[name=password]").addClass("incorrect");
		alerta("Nombre de usuario o contraseña incorrecto","error",3000);
	}else{
		$("[name=usuario]").removeClass("incorrect");
		$("[name=password]").removeClass("incorrect");
		var usuario=Meteor.userId();
		usuario=Meteor.users.findOne({_id:usuario});
		console.log(usuario)		
		if(usuario.profile.tipo=="secretaria"){
			console.log("secre")
			Router.go("secretaria",{_id:usuario._id});
		}
		if(usuario.profile.tipo=="estudiante")
			Router.go("alumno",{_id:usuario._id});
		if(usuario.profile.tipo=="maestro")
			Router.go("maestro",{_id:usuario._id});
		if(usuario.profile.tipo=="admin")
			Router.go("administrar",{_id:usuario._id})				
	}
});


}
})
Template.navbarMaestro.events({
"click .salir":function(event){
event.preventDefault();
Meteor.logout();
Router.go("entrada");
}
});
Template.navbarsecre.events({
"click .salir":function(event){
	event.preventDefault();
	Meteor.logout();
	Router.go("entrada");
}
});
Template.navbarAlumno.events({
"click .salir":function(event){
	event.preventDefault();
	Meteor.logout();
	Router.go("entrada");
}
})

Template.cursos.events({
"change #cursosTomados":function(event){
	event.preventDefault();
	var x=$("#cursosTomados").val();
	if(x)
		Session.set("cursoTomado",x);
}

})

function numControlMaestro(){
var aux=Maestros.find().fetch();
var num="M201600";
var n=parseInt(num.substr(1));	
if(aux){
	for(i=0;i<aux.length;i++){
		c=parseInt(aux[i].numControl.substr(1));			
		if(n<c)
			n=c;
	}
}
n++;
num="M"+n
return num
}

Template.calificar.events({
	"change #materias":function(event){
		event.preventDefault();
		var a=$("#materias").val();
		Session.set("actual",a);
	},
"click #subir":function(event){	
	var al=new Array();
	var numCurso=parseInt(Session.get("actual"));
		$("#tablaCals tbody tr").each(function(index){			
			var obj=new Object();						
			$(this).children("td").each(function(index2){
				switch(index2){
					case 0:obj.numControl=$(this).text();break;
					case 2: var aux=$(this).children("input").val();
							if(aux==null||aux==NaN)
								obj.calificacion=0
							else
								obj.calificacion=parseInt(aux)
					break;
				}				
			});

			al.push(obj);
			
		});
		Meteor.call("asignarCalificaciones",al,numCurso,function(error){
				if(error){
					alerta("No se han podido asignar las calificaciones "+error,"error","5000");
				}else{
					alerta("Calificaciones asignadas con exito","hecho","3000");
					$("#materias").val("");
					Session.set("actual","");
				}
		});
			
},
"keyup .calificacion":function(event){
	var x=(event.target).value;	
		if (x>100)	
		(event.target).value=100;
		if(x<0)
		(event.target).value=Math.abs(x);	
}
});


Template.unAlumno.events({
	"click .salirCurso":function(event){
		var al=event.target.dataset.alumno;
		var cur=event.target.dataset.curso;
		var alumCurso=CursoAlumno.findOne({curso:parseInt(cur),alumno:al})._id;		
		console.log(alumCurso);
		Meteor.call("bajaCurso",alumCurso,function(error){
			if(error){
				alerta(error,"error","3000");				
			}else {
				alerta("Ha sido dado de baja","hecho","3000");
			}
		})
	}
});


Template.contacto.events({
	"click #enviar":function(event){
		Meteor.call('enviarCorreo',
            'angel_507@live.com.mx',
            'icabod36@gmail.com',
            'Hello from Meteor!',
            'esta es la prueba');
	}	
})



function generarNumControl(){
var aux=Alumnos.find().fetch();
var num=201600;
if(aux){
for(i=0;i<aux.length;i++){
	if(num<aux[i].numControl)
		num=aux[i].numControl;
}
}
num++;	
return num;		
}

function generaNip(){
var nip='';
for(i=0;i<6;i++){
var aux=Math.abs(Math.round(Math.random()*10)-1);
nip=nip+""+aux	
}
return nip;
}
function generaNumCurso(){
var num=1000;
var aux=Materias.find().fetch();
if(aux){
for(i=0;i<aux.length;i++)
	if(num<aux[i].numCurso)
		num=aux[i].numCurso
}
num++
return num
}

function alerta(mensaje,tipo,tiempo){
if(tipo=="error"){
	sAlert.error(mensaje,{timeout:tiempo,position:"top",effect:"stackslide"});
}else{
	if(tipo=="hecho"){
		sAlert.success(mensaje,{timeout:tiempo,effect:"stackslide",position:"top"});	
	}
}
}

