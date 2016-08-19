Template.estadisticas.helpers({
	titulo:function(){

		var ti=Session.get("aux")
		switch(ti){
			case 1: ti="Cursos disponibles por área";break;
			case 2: ti="Alumnos registrados por sexo";break;
			case 3: ti="Alumnos inscritos a cursos por área";break;
			case 4: ti="Ganancias generadas por curso";break;
			default: ti="Estadísticas";break;
		}
		return ti;
	},
	informes:function(){
		var n=Session.get("aux");
		var data=Session.get("info");
		var data2=new Array();
		switch(n){
		 case 1: for(i=0;i<data.length;i++){
		 		data2.push({label:data[i].label,
		 					dato:data[i].value})
		 			}break;
		 case 2: for(i=0;i<data.length;i++){
		 			data2.push({label:data[i].label,
		 						dato:"Hombres: "+data[i].dato1+
		 							" Mujeres: "+data[i].dato2})
		 			}break;
		 case 3: for(i=0;i<data.length;i++){
		 			data2.push({label:data[i].label,
		 						dato:"Hombres: "+data[i].dato1+
		 							" Mujeres: "+data[i].dato2})
		 			}break;
		 case 4: for(i=0;i<data.length;i++)
		 			data2.push({label:data[i].label,
		 				dato:"$ " +data[i].dato+".00"})						
		 			break;
		 		}		
		return data2;
	},
	colum1:function(){
		var n=Session.get("aux");
		switch(n){
			case 1: return "Área académica";break;
			case 2: return "Escolaridad";break;
			case 3: return "Área académica";break;
			case 4: return "Nombre del curso";break;
		}
	},
	colum2:function(){
		var n=Session.get("aux");
		switch(n){
			case 1: return "Número de cursos";break;
			case 2: return "Número de alumnos";break;
			case 3: return "Número de alumnos";break;
			case 4: return "Ganancia generada";break;
		}
	},
	mostrar:function(){
		var n=Session.get("aux");
		if(n!="")return true;
		else return false;
	}
})
Meteor.startup(function(){
	$(window).resize(function(evt) {
    	 var p=window.location.pathname
    	 if(p.search("estadistica")){
    	 	redibujarGrafica();
    	 }
  });
})

Template.estadisticas.events({
"click .graficar":function(){
	$(".grafica").empty();
	var datos=new Array();	
	var x=parseInt($("#estadisticas").val());
	Session.set("aux",x)
	switch(x){
		case 1:
			var q=Materias.find().fetch();						
			var m=0;var c=0;var e=0;
			for(i=0;i<q.length;i++){				
				switch(q[i].area){
					case "matematicas": m=m+1; break;
					case "ciencias":    c++; break;
					case "ingles":      e++;break;
				}
			}
			datos.push({label:"Matemáticas",value:parseInt(m)});
			datos.push({label:"Ciencias",value:parseInt(c)});
			datos.push({label:"Ingles",value:parseInt(e)});
			pastel(datos);	
			break;
		case 2:
			var h1=Alumnos.find({sexo:"h",escolaridad:"primaria"}).count();
			var h2=Alumnos.find({sexo:"h",escolaridad:"secundaria"}).count();
			var h3=Alumnos.find({sexo:"h",escolaridad:"bachillerato"}).count();
			var h4=Alumnos.find({sexo:"h",escolaridad:"universidad"}).count();
			var m1=Alumnos.find({sexo:"m",escolaridad:"primaria"}).count();
			var m2=Alumnos.find({sexo:"m",escolaridad:"secundaria"}).count();
			var m3=Alumnos.find({sexo:"m",escolaridad:"bachillerato"}).count();
			var m4=Alumnos.find({sexo:"m",escolaridad:"universidad"}).count();		
			datos.push({dato1:h1,
						dato2:m1,
						label:"Primaria"});
			datos.push({dato1:h2,
						dato2:m2,
						label:"Secundaria"});
			datos.push({dato1:h3,
						dato2:m3,
						label:"Bachillerato"});
			datos.push({dato1:h4,
						dato2:m4,
						label:"Universidad"});			
			
			barras(datos);
			break;
		case 3:
			var q=CursoAlumno.find({},{fields:{alumno:1,curso:1}}).fetch();
			var Mh=0,Mm=0,Ch=0,Cm=0,Ih=0,Im=0;
				for(i=0;i<q.length;i++){					
					var al=parseInt(q[i].alumno);
					var cu=q[i].curso
					var s=Alumnos.findOne({numControl:al}).sexo
					var a=Materias.findOne({numCurso:cu}).area					
					if(s=='h'){
						switch(a){
							case "matematicas":Mh++;break;
							case "ciencias":Ch++;break;
							case "ingles":Ih++;break;
						}
					}else{
						switch(a){
							case "matematicas":Mm++;break;
							case "ciencias":Cm++;break;
							case "ingles":Im++;break;
						}
					}					
					
				}
				datos.push({label:"Matemáticas",dato1:Mh,dato2:Mm})
				datos.push({label:"Ciencias",dato1:Ch,dato2:Cm})
				datos.push({label:"Ingles",dato1:Ih,dato2:Im})
				barras(datos);
			break;
		case 4:
			var q=Materias.find().fetch();			
			for(i=0;i<q.length;i++){			
				var ganancia=q[i].cupo-q[i].cupoDisponible
				ganancia=ganancia*parseInt(q[i].costo)
				datos[i]={label:q[i].materia,
							dato:ganancia}
			}			
			barras2(datos)
		break;	
	}
	Session.set("info",datos);
}
});

function angle(d){
		 var a=(d.startAngle+d.endAngle)*90/Math.PI-90;
		 return a>90?a-180:a;
	}

function barras2(datos){
	var margin={top:60,bottom:40,left:40,right:10}	
	var width=$(".contieneGrafica").width()-parseInt(margin.left)-parseInt(margin.right);	
	var height=400-margin.bottom-margin.top-5;

	var xScale=d3.scale.ordinal()			
			.rangeRoundBands([0, width],.2,.3)
			.domain(datos.map(function(d){				
				return d.label}));			

		var yScale=d3.scale.linear()
				.range([height,0])
				.domain([0,d3.max(datos,function(d){
					return d.dato;})])		
		var ejeX=d3.svg.axis()
			.scale(xScale)
			.orient("bottom")
	

	var ejeY=d3.svg.axis()
			.scale(yScale)
			.orient("left");	

	var svg=d3.select(".grafica").append("svg")
		.attr("id","grafico")
		.attr("width",width+margin.left+margin.right)
		.attr("height",height+margin.bottom+margin.top+35)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");										

	svg.append("g")
		.attr("class","x axis")
		.attr("transform","translate(0,"+height+")")
		.call(ejeX)
	 .selectAll(".tick text")
      .call(wrap, xScale.rangeBand());
	//d3.select(".x").selectAll("text")
	//		.attr("transform","rotate(-25 ),translate(-10,15)")
			


	svg.append("g")
		.attr("class","y axis")
		.call(ejeY)	

	svg.selectAll(".bar3")
		.data(datos)
		.enter().append("rect")
				.attr("class","bar3")
				.attr("x",function(d){					
					return xScale(d.label);})
				.attr("width",0)
				.attr("y",function(d){return yScale(d.dato)})
				.attr("height",function(d){0})	
				.on("mouseover",function(d){
					d3.select(this)
						.attr("stroke"," yellow")					
						.attr("stroke-width","2px")
					svg.append("text")
					.attr("class","eti")
					.text(d.dato)
					.attr("y", yScale(d.dato)+20)
					.attr("x",  xScale(d.label) + xScale.rangeBand() / 4);
					
				})
				.on("mouseout",function(d){
					d3.select(".eti").remove();
					d3.select(this)
						.attr("stroke","")
						
				})
				.transition().delay(function(d,i){return i*100;})
					.duration(2000)
					.attr('height',function(d){return height-yScale(d.dato)})
					.attr("width",function(d){return xScale.rangeBand()})	

}

function barras(datos){	
	var margin={top:60,bottom:40,left:40,right:10}	
	var width=$(".contieneGrafica").width()-parseInt(margin.left)-parseInt(margin.right);	
	var height=400-margin.bottom-margin.top-5;

	var xScale=d3.scale.ordinal()			
			.rangeRoundBands([0, width],.2,.3)
			.domain(datos.map(function(d){				
				return d.label}));			

	var yScale=d3.scale.linear()
				.range([height,0])
				.domain([0,d3.max(datos,function(d){
					if(d.dato1>d.dato2)	
				 		return d.dato1
				 	else
				 		return d.dato2
					})])

	var ejeX=d3.svg.axis()
			.scale(xScale)
			.orient("bottom")
	

	var ejeY=d3.svg.axis()
			.scale(yScale)
			.orient("left");	

	var svg=d3.select(".grafica").append("svg")
		.attr("width",width+margin.left+margin.right)
		.attr("height",height+margin.bottom+margin.top+35)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");										

	svg.append("g")
		.attr("class","x axis")
		.attr("transform","translate(0,"+height+")")
		.call(ejeX)
	

	svg.append("g")
		.attr("class","y axis")
		.call(ejeY)	

	svg.selectAll(".bar")
		.data(datos)
		.enter().append("rect")
				.attr("class","bar")
				.attr("x",function(d){					
					return xScale(d.label);})
				.attr("width",0)
				.attr("y",function(d){return yScale(d.dato1)})
				.attr("height",function(d){0})	
				.on("mouseover",function(d){
					d3.select(this)
						.attr("stroke"," yellow")					
						.attr("stroke-width","2px")
					svg.append("text")
					.attr("class","eti")
					.text(d.dato1)
					.attr("y", yScale(d.dato1)+20)
					.attr("x",  xScale(d.label) + xScale.rangeBand() / 4);
					
				})
				.on("mouseout",function(d){
					d3.select(".eti").remove();
					d3.select(this)
						.attr("stroke","")
						
				})
				.transition().delay(function(d,i){return i*100;})
					.duration(2000)
					.attr('height',function(d){return height-yScale(d.dato1)})
					.attr("width",function(d){return .5*xScale.rangeBand()})
		

	svg.selectAll(".bar2")
		.data(datos)
		.enter()	
		.append("rect")	
		.attr("class","bar2")
		.attr("x",function(d){return xScale(d.label)+.5*xScale.rangeBand();})
		.attr("width",0)
		.attr("y",function(d){return yScale(d.dato2)})
		.attr("height",0)		
		.on("mouseover",function(d){
			d3.select(this)
				.attr("stroke"," yellow")					
				.attr("stroke-width","2px")
			svg.append("text")
			.attr('class',"eti")
			.text(d.dato2)
			.attr('y',yScale(d.dato2)+20 )
			.attr('x',xScale(d.label)+3*xScale.rangeBand()/4 )
		})
		.on("mouseout",function(d){
			d3.select(".eti").remove();
			d3.select(this)
			.attr("stroke","")											
		})
		.transition().delay(function(d,i){return i*100;})
					.duration(2000)
					.attr('height',function(d){return height-yScale(d.dato2)})
					.attr("width",function(d){return .5*xScale.rangeBand()})		

	svg.append("text")
		.text("Simbologia")
		.attr("x",30)
		.attr("y",-5)		

	svg.append("rect")
		.attr("x",30)
		.attr('y',5 )
		.attr('width',20 )
		.attr('height',10 )
		.attr('fill',"#AD2BFF");
	svg.append("text")
		.text("Mujeres")
		.attr("x",50)
		.attr("y",15)		

	svg.append("rect")
		.attr("x",30)
		.attr('y',20 )
		.attr('width',20 )
		.attr('height',10 )
		.attr('fill',"#045889")
	svg.append("text")
		.text("Hombres")
		.attr("x",50)
		.attr("y",30)				
}


function pastel(datos){
	var margin={top:60,bottom:40,left:40,right:10}	
	var width=$(".contieneGrafica").width()-parseInt(margin.left)-parseInt(margin.right);	
	var height=450-margin.bottom-margin.top-5;
    var radius=Math.min(width,height)/2;

var svg = d3.select(".grafica").append("svg")
    .attr("width", width+margin.left+margin.right-10)
    .attr("height", height+margin.top+margin.bottom)
    .append("g")
    .attr("transform", "translate(" + width/2 + "," + height/2 + ")");										
    
	svg.append("g")
	.attr('class',"slices" )	
	svg.append("g")
	.attr("class", "labels");
	svg.append("g")
	.attr("class", "lines");		

var key = function(d){ return d.data.label; };

var pie=d3.layout.pie()
		.value(function(d){
			return d.value;
		});
var color=d3.scale.category10();
var arc=d3.svg.arc();
	arc.outerRadius(parseInt(.8*radius))
		.innerRadius(0);
var outerArc = d3.svg.arc()
	.innerRadius(radius * 0.9)
	.outerRadius(radius * 0.9);

var slice = svg.select(".slices").selectAll("path.slice")
		.data(pie(datos), key);

slice.enter()
		.insert("path")
		.attr("fill", function(d,i) { return color(i); })
		.attr("class", "slice")			
		.on("mouseover",function(d){	
			d3.select(this)
			.attr('stroke',"yellow" )
			.attr("stroke-width","2px");			
			svg.append("text")
				.text(d.value)
				.attr("class","eti")
				.attr('transform',
				"translate("+arc.centroid(d)+")" );				
		})
		.on("mouseout",function(d){
			d3.select(this)			
			.attr('stroke', "");
			d3.select(".eti").remove();				
		})	
		.transition()
    	.duration( 2000)
    	.attrTween('d', tweenPie);



var text = svg.select(".labels").selectAll("text")
		.data(pie(datos), key);

	text.enter()
		.append("text")
		.attr("dy", ".35em")
		.text(function(d) {
			return d.data.label;
		})		
		.transition().delay(100)
		.duration(2000)
		.attr("y",function(d,t) {			
			this._current = d;			
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);			
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
				console.log("posx 0 "+pos[0]+" posx1 "+pos[1])
				return  pos[1] ;
			
		})
		.attr('x',function(d,t) {			
			this._current = d;		
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = 1.2*radius * (midAngle(d2) < Math.PI ? 1 : -1);				
				return  pos[0];
		
		} )	

	var polyline = svg.select(".lines").selectAll("polyline")
		.data(pie(datos), key);
	
	polyline.enter()
		.append("polyline");

	polyline.transition().delay(500)
	.duration(2000)
	.attr("points",function(d,t){
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);			
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
				return [arc.centroid(d2), outerArc.centroid(d2), pos];
					
		})
		





function tweenPie(finish) {
		console.log(finish)
    	var start = {
        	startAngle: 0,
        	endAngle: 0
    	};	
    	var i = d3.interpolate(start, finish);
    return function(d) { return arc(i(d)); };
} 

function midAngle(d){
		return d.startAngle + (d.endAngle - d.startAngle)/2;
	}
}


function redibujarGrafica(){
	$(".grafica").empty();
	var datos=new Array();	
	var x=parseInt($("#estadisticas").val());
	Session.set("aux",x)
	switch(x){
		case 1:
			var q=Materias.find().fetch();						
			var m=0;var c=0;var e=0;
			for(i=0;i<q.length;i++){
				console.log(q[i].area);
				switch(q[i].area){
					case "matematicas": m=m+1; break;
					case "ciencias":    c++; break;
					case "ingles":      e++;break;
				}
			}
			datos.push({label:"Matemáticas",value:parseInt(m)});
			datos.push({label:"Ciencias",value:parseInt(c)});
			datos.push({label:"Ingles",value:parseInt(e)});
			pastel(datos);	
			break;
		case 2:
			var h1=Alumnos.find({sexo:"h",escolaridad:"primaria"}).count();
			var h2=Alumnos.find({sexo:"h",escolaridad:"secundaria"}).count();
			var h3=Alumnos.find({sexo:"h",escolaridad:"bachillerato"}).count();
			var h4=Alumnos.find({sexo:"h",escolaridad:"universidad"}).count();
			var m1=Alumnos.find({sexo:"m",escolaridad:"primaria"}).count();
			var m2=Alumnos.find({sexo:"m",escolaridad:"secundaria"}).count();
			var m3=Alumnos.find({sexo:"m",escolaridad:"bachillerato"}).count();
			var m4=Alumnos.find({sexo:"m",escolaridad:"universidad"}).count();		
			datos.push({dato1:h1,
						dato2:m1,
						label:"Primaria"});
			datos.push({dato1:h2,
						dato2:m2,
						label:"Secundaria"});
			datos.push({dato1:h3,
						dato2:m3,
						label:"Bachillerato"});
			datos.push({dato1:h4,
						dato2:m4,
						label:"Universidad"});			
			
			barras(datos);
			break;
		case 3:
			var q=CursoAlumno.find({},{fields:{alumno:1,curso:1}}).fetch();
			var Mh=0,Mm=0,Ch=0,Cm=0,Ih=0,Im=0;
				for(i=0;i<q.length;i++){					
					var al=parseInt(q[i].alumno);
					var cu=q[i].curso
					var s=Alumnos.findOne({numControl:al}).sexo
					var a=Materias.findOne({numCurso:cu}).area					
					if(s=='h'){
						switch(a){
							case "matematicas":Mh++;break;
							case "ciencias":Ch++;break;
							case "ingles":Ih++;break;
						}
					}else{
						switch(a){
							case "matematicas":Mm++;break;
							case "ciencias":Cm++;break;
							case "ingles":Im++;break;
						}
					}
					console.log(Mh+" "+Ih+" "+Ch)
					console.log(Mm+" "+Im+" "+Cm)
				}
				datos.push({label:"Matemáticas",dato1:Mh,dato2:Mm})
				datos.push({label:"Ciencias",dato1:Ch,dato2:Cm})
				datos.push({label:"Ingles",dato1:Ih,dato2:Im})
				barras(datos);
			break;
		case 4:
			var q=Materias.find().fetch();			
			for(i=0;i<q.length;i++){
				console.log(q[i])
				var ganancia=q[i].cupo-q[i].cupoDisponible
				ganancia=ganancia*parseInt(q[i].costo)
				datos[i]={label:q[i].materia,
							dato:ganancia}
			}
			console.log(datos);
			barras2(datos)
		break;	
	}
}   
 
function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}
