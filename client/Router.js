Router.configure({
	layoutTemplate:'layout',
	notFoundTemplate:'notFound',
	loadingTemplate:'loading'
});

Router.onBeforeAction(function(){
	if(this.ready())this.next();
		else this.render("loading",{to:"body"});
	});

Router.onBeforeAction(function(){
	if(this.ready()){
		Session.set("aux","");
		Session.set("info","");
		this.next();}
		else this.render("loading",{to:"body"});
}, {
  only: ['estadistica']
});

Router.onBeforeAction(function(){
	if(this.ready()){
		Session.set("nivelCursos","");		
		this.next();}
		else this.render("loading",{to:"body"});
}, {
  only: ['alumnoCurso','infoAlumnos']
});


Router.route('/sistema',function(){
	Meteor.logout();
	this.render('encabezadoSistema',{to:'header'});
	this.render('login',{to:'body'})	
},{name:"entrada"});

Router.route('/sistema/secretaria/:_id',
	{						
	action:function(){	
		
			if(Meteor.user().profile.tipo=="secretaria"){					
				this.render('encabezadoSistema',{to:'header'})	
				this.render('bodySecretaria',{to:'body',
								data:function(){return Meteor.user()}});
			}else{		
					this.redirect("entrada");}
			
 	},
 	name:"secretaria"	
});

Router.route('/sistema/secretaria/:_id/alumno',{
	subscriptions:function(){
		return Meteor.subscribe("alumno");
	},
	action:function()
	{
		if(Meteor.user().profile.tipo=="secretaria"){
			this.render('encabezadoSistema',{to:'header'});
			this.render('alumnoNuevo',{to:'body',
								data:function(){return Meteor.user()}});
		}else
			this.redirect("entrada");
	},
name:"inscribir"});

Router.route('/sistema/secretaria/:_id/cursonuevo',
	{
	subscriptions:function(){
			var x=[	Meteor.subscribe("materia"),
					Meteor.subscribe("maestro")]
					
					return x;
		},
	action:function(){
	if(Meteor.user().profile.tipo=="secretaria"){
	this.render('encabezadoSistema',{to:'header'});
	this.render('cursoNuevo',{to:'body',
							data:function(){return Meteor.user()}});
	}
	else
		this.redirect("entrada");	
	},
	name:"cursoNuevo"})

Router.route('/sistema/secretaria/:_id/maestronuevo',{
	subscriptions:function(){
		return Meteor.subscribe('maestro');	
	},	
	action:function(){
	if(Meteor.user().profile.tipo=="secretaria"){
	this.render('encabezadoSistema',{to:'header'});
	this.render('maestroNuevo',{to:'body',
								data:function(){return Meteor.user()}});
	}else
		this.redirect("entrada");
	},
	name:"nuevoMaestro"});

Router.route('/sistema/secretaria/:_id/editaralumno',{
	subscriptions:function(){
		return Meteor.subscribe("alumno");
	},	
	action:function(){
	if(Meteor.user().profile.tipo=="secretaria"){
	this.render('encabezadoSistema',{to:'header'});
	this.render('editarAlumno',{to:'body',
								data:function(){return Meteor.user()}});
	}else
	this.redirect("entrada");
	},
name:"editarAlumno"});

Router.route('/sistema/secretaria/:_id/editarmaestro',{
	subscriptions:function(){
		return Meteor.subscribe("maestro");
	},
	action:function(){
	if(Meteor.user().profile.tipo=="secretaria"){
	this.render('encabezadoSistema',{to:'header'});
	this.render('editarMaestro',{to:'body',
								data:function(){return Meteor.user()}});
		}else
		this.redirect("entrada");
		},
name:"editarMaestro"});

Router.route('/sistema/secretaria/:_id/editarcurso',{
	subscriptions:function(){
		var x=[Meteor.subscribe("materia"),Meteor.subscribe("maestro")];
		return x;
	},
	action:function(){
	if(Meteor.user().profile.tipo=="secretaria"){
	this.render('encabezadoSistema',{to:'header'});
	this.render('editarCurso',{to:'body',
								data:function(){return Meteor.user()}});
		} else
			this.redirect("entrada");
	},
	name:"editarCurso"});

Router.route('/sistema/secretaria/:_id/alumnocurso',{
	subscriptions:function(){
		var x=[Meteor.subscribe("materia"),
				Meteor.subscribe("alumno"),
				Meteor.subscribe("maestro"),
				Meteor.subscribe("cursoalumno")]
		return x;
	},
	action:function(){
	if(Meteor.user().profile.tipo=="secretaria"){
	this.render('encabezadoSistema',{to:'header'});
	this.render('alumnoCurso',{to:'body',
								data:function(){return Meteor.user()}});
	}else
	this.redirect("entrada")
	},
	name:"alumnoCurso"});


Router.route('/sistema/secretaria/:_id/alumnosporcurso',{
	subscriptions:function(){
		var x=[Meteor.subscribe("alumno"),
				Meteor.subscribe("maestro"),
				Meteor.subscribe("materia"),
				Meteor.subscribe("cursoalumno")]
				return x;
	},
	action:function(){
	if(Meteor.user().profile.tipo=="secretaria"){
	this.render('encabezadoSistema',{to:'header'});
	this.render('alumnosXcurso',{to:'body',
									data:function(){return Meteor.user()}});
	}else
	this.redirect("entrada")
	},
	name:"alumnosCurso"});

Router.route('/sistema/secretaria/:_id/infoalumnos',{
	subscriptions:function(){
				var x=[Meteor.subscribe("alumno"),				
				Meteor.subscribe("cursoalumno")]
				return x;
	},
	action:function(){
		if(Meteor.user().profile.tipo=="secretaria"){
			this.render("encabezadoSistema",{to:"header"});
			this.render("infoAlumnos",{to:"body",
										data:function(){return Meteor.user()}});
		}else{
			this.redirect("entrada");
		}
	},
	name:"infoAlumnos"});

Router.route('/sistema/secretaria/:_id/info/:alumno',{
	subscriptions:function(){
		var x=[Meteor.subscribe("alumno"),
				Meteor.subscribe("maestro"),
				Meteor.subscribe("materia"),
				Meteor.subscribe("cursoalumno")]
				return x;
	},
	action:function(){
		if(Meteor.user().profile.tipo=="secretaria"){
			this.render("encabezadoSistema",{to:"header"});
			this.render("unAlumno",{to:"body",
								data:function(){
										var al=this.params.alumno;
										Session.set("alumno",al);
										var datos={alum: Alumnos.findOne({_id:al}),
													_id:Meteor.userId()
													}
													console.log(datos);
											return datos;
										}});
		}else{
			this.redirect("entrada");
		}
	},
	name:"unAlumno"});



Router.route('/sistema/secretaria/:_id/infocursos',{
	subscriptions:function(){
		return Meteor.subscribe("materia");
	},
	action:function(){
		if(Meteor.user().profile.tipo=="secretaria"){
			this.render("encabezadoSistema",{to:"header"});
			this.render("infoCursos",{to:"body",
										data:function(){return Meteor.user()}});
		}else{
			this.redirect("entrada");
		}
	},
	name:"infoCursos"});

Router.route('/sistema/secretaria/:_id/infomaestros',{
	subscriptions:function(){
		return Meteor.subscribe("maestro");
	},
	action:function(){
		if(Meteor.user().profile.tipo=="secretaria"){
			this.render("encabezadoSistema",{to:"header"});
			this.render("infoMaestros",{to:"body",
										data:function(){return Meteor.user()}});
		}else{
			this.redirect("entrada");
		}
	},
	name:"infoMaestros"});

Router.route('/sistema/secretaria/:_id/infoprofe/:maestro',{
	subscriptions:function(){
		var x=[Meteor.subscribe("alumno"),
				Meteor.subscribe("maestro"),
				Meteor.subscribe("materia"),
				Meteor.subscribe("cursoalumno")]
				return x;
	},
	action:function(){
		if(Meteor.user().profile.tipo=="secretaria"){
			this.render("encabezadoSistema",{to:"header"});
			this.render("unMaestro",{to:"body",
								data:function(){
										var al=this.params.maestro;
										var datos={maes: Maestros.findOne({_id:al}),
													_id:Meteor.userId()
													}													
											return datos;
										}});
		}else{
			this.redirect("entrada");
		}
	},
	name:"unMaestro"});

Router.route("/sistema/secretaria/:_id/infocurso/:curso",{
	subscriptions:function(){
		var x=[	Meteor.subscribe("maestro"),
				Meteor.subscribe("materia")]
				return x;
	},
	action:function(){
		if(Meteor.user().profile.tipo=="secretaria"){
			this.render("encabezadoSistema",{to:"header"});
			this.render("unCurso",{to:"body",
								data:function(){
										var al=this.params.curso;
										var datos={curso: Materias.findOne({_id:al}),
													_id:Meteor.userId()
													}													
											return datos;
										}});
		}else{
			this.redirect("entrada");
		}
	},
	name:"unCurso"
});


Router.route("/sistema/secretaria/:_id/estadisticas",{
	subscriptions:function(){
			var x=[Meteor.subscribe("maestro"),
					Meteor.subscribe("alumno"),
					Meteor.subscribe("materia"),
					Meteor.subscribe("cursoalumno")];
					return x;
	},
	action:function(){
		if(Meteor.user().profile.tipo=="secretaria"){
			this.render("encabezadoSistema",{to:"header"});
			this.render("estadisticas",{to:"body",data:function(){
					return Meteor.user();
			}});
		}else{
			this.redirect("entrada")
		}
	},
	name:"estadistica"
});




Router.route('/sistema/alumno/:_id',{	
	action:function(){
	if(Meteor.user()){
		var x=Meteor.user().profile.tipo;		
		if(x=="estudiante"){	
	this.render('encabezadoSistema',{to:'header'})
	this.render('alumnoBody',{to:'body',
							data:function(){
								return Meteor.user();
							}});	}
	}else{
	Router.go("/");
	}},
	name:"alumno"});

Router.route('/sistema/alumno/:_id/cursos',{
	subscriptions:function(){
		var x=[Meteor.subscribe("mismaterias",Meteor.user().username),
				Meteor.subscribe("mismaestros"),
				Meteor.subscribe("materiasAlumno")];
			return x;
	},
	action:function(){
	if(Meteor.userId()){		
	this.render('encabezadoSistema',{to:'header'})
	this.render('cursos',{to:'body',
						data:function(){							
							return Meteor.user();
						}});
		}else
		this.go("/")		
	},
name:"cursosdealumno"});



Router.route('/sistema/maestro/:_id',{
action:function(){
	console.log(Meteor.user())
	var id=Meteor.user().profile.tipo;
	console.log(id);
	if(id=="maestro"){						
		this.render('encabezadoSistema',{to:'header'})
		this.render('MaestroBody',{to:'body',
								data:function(){									
									return Meteor.user();
								}}
		);}	
	else
		Router.go("/");
			
	},
name:"maestro"});

Router.route('/sistema/maestro/:_id/calificar',{
	subscriptions:function(){
		Session.set("actual","");
		var x=[Meteor.subscribe("mismateriasProfe",Meteor.user().username),
				Meteor.subscribe("misalumnos"),
				Meteor.subscribe("alumnosprofe")]
				return x;			
	},
	action:function(){
	if(Meteor.user().profile.tipo=="maestro"){		
		this.render('encabezadoSistema',{to:'header'})
		this.render('Calificar',{to:'body',
							data:function(){
								return Meteor.user();
							}});
	}else{
		Router.go("/");
	}},
	name:"maestroCalificar"});




Router.route("/admin/:_id",{
	action:function(){
	if(Meteor.user().profile.tipo=="admin"){
	this.render("encabezadoAdmin",{to:"header"})
	this.render("admin",{to:"body",data:function(){return Meteor.user()}})
	}else{
		Router.go("entrada")
	}},
	name:"administrar"
});

Router.route("/admin/:_id/nuevoUsuario",{
	subscriptions:function(){return Meteor.subscribe("users");},
	action:function(){
		if(Meteor.user().profile.tipo=="admin"){
	this.render("encabezadoAdmin",{to:"header"})
	this.render("usuarioNuevo",{to:"body",data:function(){return Meteor.user()}})
	}else{
		Router.go("entrada")
	}},
	name:"nuevoUsuario"	
})

Router.route("/admin/:_id/editarUsuario",{
	subscriptions:function(){return Meteor.subscribe("users");},
	action:function(){
		if(Meteor.user().profile.tipo=="admin"){
	this.render("encabezadoAdmin",{to:"header"})
	this.render("editarUsuario",{to:"body",data:function(){return Meteor.user()}})
	}else{
		Router.go("entrada")
	}},
	name:"cambioContraseña"	
})

Router.route("/admin/:_id/eliminarUsuario",{
	subscriptions:function(){return Meteor.subscribe("users");},
	action:function(){
		if(Meteor.user().profile.tipo=="admin"){
	this.render("encabezadoAdmin",{to:"header",data:function(){return Meteor.user()}})
	this.render("eliminarUsuario",{to:"body",data:function(){return Meteor.user()}})
	}else{
		Router.go("entrada")
	}},
	name:"borrarUsuario"	
})

Router.route("/admin/:_id/publicaciones",{
	subscriptions:function(){return Meteor.subscribe("users");},
	action:function(){
		if(Meteor.user().profile.tipo=="admin"){
	this.render("encabezadoAdmin",{to:"header",data:function(){return Meteor.user()}})
	this.render("AdministrarBlog",{to:"body",data:function(){return Meteor.user()}})
	}else{
		Router.go("entrada")
	}},
	name:"publicaciones"	
})


Router.route("/",function(){	
	this.render('encabezadoPagina',{to:'header'});
	this.render('pagina',{to:'body'})	
})

Router.route("/nosotros",function(){	
	this.render('encabezadoPagina',{to:'header'});
	this.render('nosotros',{to:'body'})	
})

Router.route("/contacto",function(){	
	this.render('encabezadoPagina',{to:'header'});
	this.render('contacto',{to:'body'})	
})

Template.layout.onRendered(function() {
  console.log(this)
  this.find('#main')._uihooks = {

    insertElement: function(node, next) {
      
      $(node)
        .hide()
        .insertBefore(next)
        .fadeIn(1000);
    },
    removeElement: function(node) {
      $(node).animate({height:0},{
      				duration:800,
      				done:function() {
        				$(this).remove()}
      				});
    }
  }
});