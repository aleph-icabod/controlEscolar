Template.editarAlumno.helpers({
    alumnos: function() {
        return Alumnos.find().fetch();
    }
});

Template.editarMaestro.helpers({
    maestros: function() {
        return Maestros.find().fetch()
    }
});

Template.cursoNuevo.helpers({
    maestros: function() {
        var aux = Session.get("area")
        return Maestros.find({
            especialidad: aux,
        }).fetch();
    }
});

Template.editarCurso.helpers({
    maestros: function() {
        return Maestros.find({}).fetch();
    },
    cursos: function() {
        return Materias.find().fetch();
    }
});

Template.alumnoCurso.helpers({
    alumnos: function() {
        var x = Session.get("nivelCursos")
        console.log(Alumnos.find({
            escolaridad: x
        }).fetch().length)
        return Alumnos.find({
            escolaridad: x
        }).fetch()
    },
    cursos: function() {
        var x = Session.get("nivelCursos");
        return Materias.find({
            nivel: x
        }).fetch()
    }
});


Template.alumnosXcurso.helpers({
    cursos: function() {
        return Materias.find().fetch();
    },
    alumnosCurso: function() {
        var actual = Session.get("cursoSeleccionado");
        var alumnos = CursoAlumno.find({
            curso: parseInt(actual)
        }).fetch();
        var alumnosCurso = new Array();
        for (i = 0; i < alumnos.length; i++) {
            var nc = alumnos[i].alumno
            var nombre = Alumnos.findOne({
                numControl: parseInt(nc)
            }).nombre;
            var apPat = Alumnos.findOne({
                numControl: parseInt(nc)
            }).apPat;
            var apMat = Alumnos.findOne({
                numControl: parseInt(nc)
            }).apMat;
            var fecha = alumnos[i].fechaInscripcion;
            fecha = fecha.toLocaleDateString("es-MX", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                hour12: "false",
                minute: "numeric"
            });
            var pago = alumnos[i].pago
            alumnosCurso[i] = {
                numControl: nc,
                nombre: nombre,
                apPat: apPat,
                apMat: apMat,
                fecha: fecha,
                pago: pago
            };
        }
        return alumnosCurso;
    },
    actual: function() {
        var a = parseInt(Session.get("cursoSeleccionado"));
        if (a != null && a != undefined && a != '')
            return Materias.findOne({
                numCurso: a
            }).materia;
        else
            return "";
    },
    maestro: function() {
        var a = parseInt(Session.get("cursoSeleccionado"));
        var m = Materias.findOne({
            numCurso: a
        }).maestro;
        m = Maestros.findOne({
            numControl: m
        }).nombre + " " + Maestros.findOne({
            numControl: m
        }).apPat + " " + Maestros.findOne({
            numControl: m
        }).apMat;
        return m;
    }
})

Template.cursos.helpers({
    cursos: function() {
        var c = CursoAlumno.find().fetch()
        var a = new Array()
        for (i = 0; i < c.length; i++) {
            a[i] = {
                curso: c[i].curso,
                materia: Materias.findOne({
                    numCurso: c[i].curso
                }).materia
            }
        }
        return a;
    },
    nombreMaestro: function() {
        var x = Session.get("cursoTomado");
        if (x != "") {
            var nombre = Materias.findOne({
                numCurso: parseInt(x)
            }).maestro;
            nombre = Maestros.findOne({
                numControl: nombre
            })
            return nombre.nombre + " " + nombre.apPat + " " + nombre.apMat;
        }

    },
    horario: function() {
        var x = Session.get("cursoTomado");
        if (x != "") {
            x = Materias.findOne({
                numCurso: parseInt(x)
            })
            return x.horaInicio + " " + x.horafin;
        }
    },
    calificacion: function() {
        var x = parseInt(Session.get("cursoTomado"));
        if (x != "") {
            var n = Meteor.user().username + "";
            var c = CursoAlumno.findOne({
                curso: x,
                alumno: n
            })
            if (c.calificacion != undefined)
                return c.calificacion;
            else
                return "Sin asignar";
        }
    }
})

Template.calificar.helpers({
    cursos: function() {
        return Materias.find().fetch();
    },
    actual: function() {
        var x = Session.get("actual");
        return Materias.findOne({
            numCurso: parseInt(x)
        }).materia;
    },
    alumnosInscritos: function() {
        var curso = Session.get("actual");
        var alumnos = CursoAlumno.find({
            curso: parseInt(curso)
        }).fetch();
        var x = new Array()
        for (i = 0; i < alumnos.length; i++) {
            var a = Alumnos.findOne({
                numControl: parseInt(alumnos[i].alumno)
            });
            x[i] = {
                numControl: a.numControl,
                nombre: a.nombre,
                apPat: a.apPat,
                apMat: a.apMat,
                calificacion: alumnos[i].calificacion
            }

        }
        return x;
    }
})

Template.infoAlumnos.helpers({
    alumnos: function() {
        var x = Session.get("nivelCursos")
        var a = Alumnos.find({
            escolaridad: x
        }, {
            sort: {
                numControl: 1
            }
        }).fetch();
        for (i = 0; i < a.length; i++) {
            var r = "" + a[i].numControl;
            console.log(r)
            var n = CursoAlumno.find({
                alumno: r
            }).count();
            a[i].cursosQueToma = n;
        }
        return a;
    }
})
Template.infoCursos.helpers({
    cursos: function() {
        return Materias.find({}, {
            sort: {
                nivel: 1
            }
        }).fetch();
    }
});
Template.infoMaestros.helpers({
    maestros: function() {
        return Maestros.find({}, {
            sort: {
                especialidad: 1
            }
        }).fetch();
    }
});

Template.unAlumno.helpers({
    cursostomados: function() {
        var id = Session.get("alumno");
        id = Alumnos.findOne({
            _id: id
        }).numControl + "";
        var cur = CursoAlumno.find({
            alumno: id
        }).fetch();
        console.log(cur);
        var y = new Array();
        for (i = 0; i < cur.length; i++) {
            var mat = Materias.findOne({
                numCurso: cur[i].curso
            });
            console.log(mat)
            var maes = Maestros.findOne({
                numControl: mat.maestro
            })
            maes = maes.nombre + " " + maes.apPat + " " + maes.apMat;
            var desc = Materias.findOne({
                numCurso: cur[i].curso
            }).descripcion;
            y[i] = {
                numCurso: cur[i].curso,
                materia: mat.materia,
                maestro: maes,
                descripcion: desc,
                horario: mat.horaInicio + " - " + mat.horafin,
                calificacion: cur[i].calificacion,
                fecha: cur[i].fechaInscripcion.toLocaleDateString("es-MX", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    hour12: "false",
                    minute: "numeric"
                }),
                alumno: id
            }
        }
        return y
    }
})


Template.infoAlumnos.events({
    "click .infoAlumno": function(event) {
        var x = event.target
        console.log(x.dataset.alumno);

        Router.go("unAlumno", {
            _id: Meteor.userId,
            alumno: x.dataset.alumno
        });
    },
    "change #nivel": function(event) {
        var x = $("#nivel").val();
        Session.set("nivelCursos", x)
    }
})

Template.infoMaestros.events({
    "click .infoMaestro": function(event) {
        var x = event.target
        console.log(x.dataset.maestro);
        Session.set("maestro", x.dataset.maestro)
        Router.go("unMaestro", {
            _id: Meteor.userId,
            maestro: x.dataset.maestro
        });
    }

});
Template.infoCursos.events({
    "click .infoCurso": function(event) {
        var x = event.target
        console.log(x.dataset.curso);
        Session.set("curso", x.dataset.curso)
        Router.go("unCurso", {
            _id: Meteor.userId,
            curso: x.dataset.curso
        });
    }
})

Template.unMaestro.helpers({
    cursosimpartidos: function() {
        var n = Session.get("maestro")
        n = Maestros.findOne({
            _id: n
        }).numControl;
        var m = Materias.find({
            maestro: n
        }).fetch();
        return m;
    }
})

Template.unCurso.helpers({
    maestro: function() {
        var x = Session.get("curso");
        x = Materias.findOne({
            _id: x
        }).maestro;
        x = Maestros.findOne({
            numControl: x
        });
        return x.nombre + " " + x.apPat + " " + x.apMat;
    },
    cupo: function() {
        var x = Session.get("curso");
        x = Materias.findOne({
            _id: x
        });

        x = x.cupo - x.cupoDisponible;
        return x;
    }
});


Template.contacto.onRendered(function() {
    GoogleMaps.load();
});

Template.contacto.helpers({
    geolocationError: function() {
        var error = Geolocation.error();
        return error && error.message;
    },
    mapOptions: function() {
        var latLng = Geolocation.latLng();
        // Initialize the map once we have the latLng.
        if (GoogleMaps.loaded() && latLng) {
            return {
                center: new google.maps.LatLng(latLng.lat, latLng.lng),
                zoom: 15
            };
        }
    }
});

Template.contacto.onCreated(function() {
    GoogleMaps.ready('map', function(map) {
        var latLng = Geolocation.latLng();
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(latLng.lat, latLng.lng),
            map: map.instance
        });

        var directionsService = new google.maps.DirectionsService();
        var directionsRenderer = new google.maps.DirectionsRenderer();
        console.log(map)
        directionsRenderer.setMap(map.instance)
        var posEscuela = new google.maps.LatLng(17.0760867, -96.7127606);
        var marcador = new google.maps.Marker({
            map: map.instance,
            draggable: false,
            position: posEscuela,
            visible: true
        });
        var request = {
            origin: Geolocation.latLng(),
            destination: posEscuela,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        }
        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsRenderer.setDirections(response);
            }
        });

    });



});
