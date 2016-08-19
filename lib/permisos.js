Meteor.methods({
addAlumno:function(alumno){		
	if(Meteor.user().profile.tipo=="secretaria"){
		var x=Alumnos.findOne({nombre:alumno.nombre,
			apPat:alumno.apPat,
			apMat:alumno.apMat,
			email:alumno.email
		});
		if(x)
			throw new Meteor.Error("El alumno ya esta registrado en el sistema "+x.numControl);
		else{	
			Alumnos.insert(alumno);
			var nuevoAlumno=Accounts.createUser({
				username:""+alumno.numControl,
				password:alumno.nip,
				tipo:"estudiante",
				nombreUsuario:alumno.nombre+" "+alumno.apPat+" "+alumno.apMat
			});
			return nuevoAlumno;
		}
		}
		else{
			throw new Meteor.Error("No tiene permiso para crear nuevo alumno");	
		}
	},
addMaestro:function(maestro){
	if(Meteor.user().profile.tipo=="secretaria"){
		var x=Maestros.findOne({rfc:maestro.rfc});
		if(x) throw new Meteor.Error("Ya existe un maestro con el mismo rfc");
		else{
		Maestros.insert(maestro);
		var maestroNuevo=Accounts.createUser({
			username:maestro.numControl,
			password:maestro.nip,
			tipo:"maestro",
			nombreUsuario:maestro.nombre+" "+maestro.apPat+" "+maestro.apMat
			});
		return maestroNuevo;}
	}else{
		throw new Meteor.Error("Sin permisos para esta operacion");
		}	
	},
addCurso:function(curso){
	if(Meteor.user().profile.tipo=="secretaria"){
		var x=Materias.findOne({maestro:curso.maestro,horaInicio:curso.horaInicio});
			if(x)
				throw new Meteor.Error("El maestro ya ha sido asignado a una clase en ese horario");
			else
			Materias.insert(curso);			
		}else
		throw new Meteor.Error("Sin permisos para esta operacion");
	},
inscribirAlumno:function(alumnoCurso,cursoId){
	if(Meteor.user().profile.tipo=="secretaria"){
		var x=Materias.findOne({_id:cursoId});
		console.log(x);
		if(x.cupoDisponible>0){
		CursoAlumno.insert(alumnoCurso);			

		Materias.update({_id:cursoId},{$inc:{
			cupoDisponible:-1
			}});
		var x=Materias.findOne({_id:cursoId});		
	}
		else
			throw new Meteor.Error("No hay cupo suficiente en este curso");
	}else
		throw new Meteor.Error("No tiene permisos para realizar esta operacion");
	},
actualizaAlumno:function(alumno,id){
	if(Meteor.user().profile.tipo=="secretaria"){
		Alumnos.update({_id:id},
			{$set:
			{domicilio:alumno.domicilio,
			sexo:alumno.sexo,
			telefono:alumno.telefono,
			email:alumno.email,
			escolaridad:alumno.escolaridad,
			nombre:alumno.nombre,
			apPat:alumno.apPat,
			apMat:alumno.apMat
			}});
	}else
		throw new Meteor.Error("Permiso denegado");
	},
actualizarMaestro:function(maestro,id){
	if(Meteor.user().profile.tipo=="secretaria"){
		var x=Maestros.findOne({rfc:maestro.rfc});
		if(x) throw new Meteor.Error("Ya existe un maestro con el mismo RFC");
		else{
		Maestros.update({_id:id},{
			$set:{
			nombre:maestro.nombre,
			apPat:maestro.apPat,
			apMat:maestro.apMat,
			especialidad:maestro.especialidad,
			rfc:maestro.rfc,
			telefono:maestro.telefono,
			domicilio:maestro.direccion,
			email:maestro.email	}
			});}
	}else
		throw new Meteor.Error("Permiso denegado");
	},
actualizarCurso:function(curso,id){
	if(Meteor.user().profile.tipo=="secretaria"){			
		var x=Materias.find({maestro:curso.maestro,horaInicio:curso.horaInicio}).fetch();

		if(x.length>1)
			throw new Meteor.Error("El maestro ya ha sido asignado a una clase en ese horario");
		else{
		Materias.update({_id:id},{$set:{
				area:curso.area,
				maestro:curso.maestro,
				nivel:curso.nivel,
				cupo:curso.cupo,
				cupoDisponible:curso.cupoDisponible,			
				horaInicio:curso.horaInicio,
				horafin:curso.horafin,
				materia:curso.materia,
				costo:curso.costo,
				descripcion:curso.descripcion
		}});}
	}else {
			throw new Meteor.Error("Permiso denegado");
		}
	},

asignarCalificaciones:function(alumno,numCurso){
	if(Meteor.user().profile.tipo=="maestro"){
		for(i=0;i<alumno.length;i++){
			var aux=alumno[i];
			var id=CursoAlumno.findOne({curso:numCurso,alumno:aux.numControl})._id;
			CursoAlumno.update({_id:id},{$set:{
				calificacion:aux.calificacion
			}})	
		}
	}else{
		throw new Meteor.Error("Sin autorizacion");
	}
},
bajaCurso:function(id){
	if(Meteor.user().profile.tipo=="secretaria"){
		var cur=CursoAlumno.findOne({_id:id}).curso;
		cur=Materias.findOne({numCurso:cur})._id;
		Materias.update({_id:cur},{$inc:{
			cupoDisponible:1
		}})
		CursoAlumno.remove(id);
	}
		else{
			throw new Meteor.Error("Sin permiso para la operacion");
		}
},
addUsuario:function(user){
	if(Meteor.user().profile.tipo=="admin"){
		var usuario=Accounts.createUser({
			username:user.username,
			password:user.password,
			tipo:user.tipo,
			nombreUsuario:user.nombreUsuario
		});
		return usuario;
	}else{
		throw  new Meteor.Error("Permiso denegado");
	}
},
updateUsuario:function(user,anterior){
	if(Meteor.user().profile.tipo=="admin"){
		var anterior=Meteor.users.findOne({username:anterior});
		console.log(anterior);
		Meteor.users.remove(anterior._id);
		var usuario=Accounts.createUser({
			username:user.username,
			password:user.password,
			tipo:user.tipo,
			nombreUsuario:user.nombreUsuario
		});
		return usuario;
	}else{
		throw  new Meteor.Error("Permiso denegado");
	}
},
dropUsuario:function(user){
	if(Meteor.user().profile.tipo=="admin"){
		var x=Meteor.users.findOne({username:user.username});
		Meteor.users.remove(x._id);
	}else{
		throw new Meteor.Error("Permiso denegado");
	}
},
enviarCorreo:function(to,from,subject,text){
	this.unblock();

    Email.send({
      to: to,
      from: from,
      subject: subject,
      text: text
    });
  }



});