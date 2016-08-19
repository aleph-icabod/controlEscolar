Template.menuAdmin.events({
	"click .salir":function(event){
		Router.go("entrada");
		Meteor.logout();
	}
});

Template.usuarioNuevo.events({
	"submit #usuarioNuevo":function(event){
		event.preventDefault();
		var nombre=$("#nombre").val();
		var apPat=$("#apPat").val();
		var apMat=$("#apMat").val();
		var username=$("#usuario").val();
		var tipo=$("[name=tipo]:checked").val();
		var pass1=$("#pass").val()
		var pass2=$("#pass2").val()
		if(pass1===pass2){
			var user={
				username:username,
				password:pass1,
				tipo:tipo,
				nombreUsuario:nombre+" "+apPat+" "+apMat
			};

			Meteor.call("addUsuario",user,function(error,done){
				if(error){
					alerta(error.reason,"error","3000");
				}else{
					alerta("Usuario creado con exito","hecho","3000");
					document.getElementById("usuarioNuevo").reset();
				}
			})
		}else{
			alerta("Las contraseñas deben ser iguales","error","3000");
			$("#pass").val();
			$("#pass2").val();
		}
	},
	"click #cancelar":function(event){
		document.getElementById("usuarioNuevo").reset();
	}
});

Template.editarUsuario.helpers({
	usuarios:function(){
		console.log(Meteor.users.find().fetch())
		return Meteor.users.find().fetch();
	}
});

Template.editarUsuario.events({
	"change #usu":function(event){
		var usuario=$("#usu").val();
		if(usuario!=""){
		 usuario=Meteor.users.findOne({username:usuario})
		 var n=usuario.profile.nombreUsuario.split(" ");
		 console.log(n)
		 $("#nombre").val(n[0]);
		 $("#apPat").val(n[1]);
         $("#apMat").val(n[2]);
		 $("#usuario").val(usuario.username);
         $("input:checked").prop("checked",false);
		 $("input[value="+usuario.profile.tipo+"]").prop("checked",true);	
         }else{
         	document.getElementById("editarUsuario").reset();
         }
         
	},
	"submit #editarUsuario":function(event){
		event.preventDefault();	
		var nombre=$("#nombre").val();
		var apPat=$("#apPat").val();
		var apMat=$("#apMat").val();
		var username=$("#usuario").val();
		var tipo=$("[name=tipo]:checked").val();
		var pass1=$("#pass").val()
		var pass2=$("#pass2").val()
		var anterior=$("#usu").val();
		if(pass1===pass2){
			var user={
				username:username,
				password:pass1,
				tipo:tipo,
				nombreUsuario:nombre+" "+apPat+" "+apMat
			};
			Meteor.call("updateUsuario",user,anterior,function(error){
				if(error){
					alerta(error.reason,"error","3000")
				}else{
					alerta("Actualizacion correcta","hecho","3000")
					document.getElementById("editarUsuario").reset();
				}
			})
		}else{
			alerta("Las contraseñas deben ser iguales","error","3000");
			$("#pass").val("")
			$("#pass2").val("")
		}	
	},
"click .cancelar":function(event){document.getElementById("editarUsuario").reset();}	
});

Template.eliminarUsuario.helpers({
	usuarios:function(){
		 	var x=Meteor.users.find().fetch();
		 	var y=new Array()
		 	for(i=0;i<x.length;i++)
		 		if(x[i].username!=Meteor.user().username)
		 		y.push(x[i]);
		 return y;			
	}
})

Template.eliminarUsuario.events({
		"change #usu":function(event){
		var usuario=$("#usu").val();
		if(usuario!=""){
		 usuario=Meteor.users.findOne({username:usuario})
		 var n=usuario.profile.nombreUsuario.split(" ");
		 console.log(n)
		 $("#nombre").val(n[0]);
		 $("#apPat").val(n[1]);
         $("#apMat").val(n[2]);
		 $("#usuario").val(usuario.username);
         $("input:checked").prop("checked",false);
		 $("input[value="+usuario.profile.tipo+"]").prop("checked",true);	
         }else{
         	document.getElementById("eliminarUsuario").reset();
         }
         
	},
	"submit #eliminarUsuario":function(event){
		event.preventDefault();	
		var nombre=$("#nombre").val();
		var apPat=$("#apPat").val();
		var apMat=$("#apMat").val();
		var username=$("#usuario").val();
		var tipo=$("[name=tipo]:checked").val();						
			var user={
				username:username,				
				tipo:tipo,
				nombreUsuario:nombre+" "+apPat+" "+apMat
			};
			Meteor.call("dropUsuario",user,function(error){
				if(error){
					alerta(error.reason,"error","3000")
				}else{
					alerta("Eliminacion correcta","hecho","3000")
					document.getElementById("eliminarUsuario").reset();
				}
			})
		
	},
"click .cancelar":function(event){document.getElementById("editarUsuario").reset();}
})
function alerta(mensaje,tipo,tiempo){
if(tipo=="error"){
	sAlert.error(mensaje,{timeout:tiempo,position:"top",effect:"stackslide"});
}else{
	if(tipo=="hecho"){
		sAlert.success(mensaje,{timeout:tiempo,effect:"stackslide",position:"top"});	
	}
}
}