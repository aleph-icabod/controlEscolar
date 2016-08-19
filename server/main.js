import { Meteor } from 'meteor/meteor';


Meteor.startup(() => {
	   process.env.MAIL_URL ="smtp://postmaster%40pdg.com:5aaf9d8774be6eaf1e96d92bdbdd0306@smtp.mailgun.org:587";
	 if(!Meteor.users.findOne()){
	 	var admin=Meteor.users.insert({username:"administrador",
	 									profile:{tipo:"admin",
	 											nombreUsuario:"Pedro de Gante"}},
	 											function(error){
	 												if(error){
	 													console.log(error.reason)
	 												}
	 											});

	 		Accounts.setPassword(admin,"pedr0d3g@nte");

	 	var aux=Meteor.users.insert({username:"Coordinadora",
						profile:{tipo:"secretaria",
								nombreUsuario:"Colegio Pedro de Gante"}
						},
						function(error){
							if(error)
								console.log(error.reason);															
						});
	 	Accounts.setPassword(aux,"pedrodegante");	
	 	
	 }
	 if(!Alumnos.findOne()){
	 	var fs = Meteor.npmRequire('fs');
	 	var files = fs.readdirSync('./assets/app/jsonfiles/');	 		 	
	 		try{	 			
	 			var alumnos="jsonfiles/"+files[0]
	 			var maestros="jsonfiles/"+files[2]
	 			var cursos="jsonfiles/"+files[1]
		 		var al = JSON.parse(Assets.getText(alumnos));		 				 			
				for(i=0;i<al.length;i++){
					Alumnos.insert(al[i]);
					var n=Meteor.users.insert({
						username:""+al[i].numControl,
						profile:{tipo:"estudiante",
								nombreUsuario:al[i].nombre+" "+al[i].apPat+" "+al[i].apMat}
					});
					Accounts.setPassword(n,al[i].nip);	
				}
				var ma=JSON.parse(Assets.getText(maestros));
				for(i=0;i<ma.length;i++){
					Maestros.insert(ma[i]);
					var n=Meteor.users.insert({
						username:ma[i].numControl,
						profile:{tipo:"maestro",
								nombreUsuario:ma[i].nombre+" "+ma[i].apPat+" "+ma[i].apMat}
					});
					Accounts.setPassword(n,ma[i].nip);
				}
				var cur=JSON.parse(Assets.getText(cursos));	
				for(i=0;i<cur.length;i++){
					Materias.insert(cur[i]);
				}

		 	}
		 	catch(e){
		 			console.log(e);
		 	}

	 }


});

Meteor.publish('alumno',function(){	
		return Alumnos.find();	
});

Meteor.publish('maestro',function(){
			return Maestros.find();
}) ; 
Meteor.publish('materia',function(){
	return Materias.find();
});

Meteor.publish('cursoalumno',function(){
	return CursoAlumno.find();
})

Meteor.publish('users',function(){
	return Meteor.users.find({"profile.tipo":"secretaria"},
		{fields:{username:1,
				profile:1}});

})

Meteor.publish('mismaterias',function(username){
	return CursoAlumno.find({alumno:username})
});

Meteor.publish('materiasAlumno',function(){
	return Materias.find({},{fields:{
							numCurso:1,
							materia:1,
							horaInicio:1,
							horafin:1,
							maestro:1,
							area:1
	}})
});
Meteor.publish('mismaestros',function(){
	return Maestros.find({},{fields:{
					nombre:1,
					apPat:1,
					apMat:1,
					numControl:1		
	}});
});


Meteor.publish("mismateriasProfe",function(username){
	return Materias.find({maestro:username}); 
});

Meteor.publish("misalumnos",function(){
	return Alumnos.find({},{fields:{
		nombre:1,
		apPat:1,
		apMat:1,
		numControl:1
	}});
});

Meteor.publish("alumnosprofe",function(){
	return CursoAlumno.find({},{fields:{
		alumno:1,
		calificacion:1,
		curso:1
	}});
})

Accounts.onCreateUser(function(options,user){
		user.profile=options.profile ||{};
		user.profile.tipo=options.tipo;
		user.profile.nombreUsuario=options.nombreUsuario;		
		return user;		
});