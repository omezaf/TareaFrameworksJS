// Iniciar variables
var buscarHoriz = 0;
var buscarVert = 0;
var buscarNewCandy = 0;
var lencolum = ["","","","","","",""];
var lenrest = ["","","","","","",""];
var maximo = 0;
var matriz = 0;
var intervalo = 0;
var eliminarCandy = 0;
var nuevosCandy = 0;
var tiempo = 0;
var i = 0;
var contaGen = 0;
var espera = 0;
var score = 0;
var mov = 0;
var min = 2;
var seg = 0;


// Animacion para cambiar color de titulo
var juegoDulces = {
  animacionTitulo: function(){
    setInterval(function(){
      $(".main-titulo").animate({color: "#DCFF0E"}, 1000),
      $(".main-titulo").animate({color: "#FFFFFF"}, 1000)
    }, 300);
  },
}

// funcion boton iniciar
$(".btn-reinicio").click(function(){
	$(".panel-score").css("width","25%");
	$(".panel-tablero").show();
	$(".time").show();
	$("#score-text").html("0");
	$("#movimientos-text").html("0");
	$(this).html('<a href="" class="reinicio">Reiniciar</a>');
	intervalo=setInterval(function(){
		moverPieza()
	},600);
	tiempo=setInterval(function(){
		timer()
	},1000);
});

// funcion mover piezas
function moverPieza(){
	i=i+1
	var numero=0;
	var imagen=0;
	$(".elemento").draggable({disabled:true});
	if(i<8){
		for(var j=1;j<8;j++){
			if($(".col-"+j).children("img:nth-child("+i+")").html()==null){
				numero=Math.floor(Math.random()*4)+1;
				imagen="image/"+numero+".png";
				$(".col-"+j).prepend("<img src="+imagen+" class='elemento'/>").css("justify-content","flex-start")
			}}}
	if(i==8){
		clearInterval(intervalo);
		eliminarCandy=setInterval(function(){
			desaparecerPiezas()
		},150);
	}
};

// Funcion Timer
function timer(){
	var cero = '';
	if(seg < 10){
		cero = '0';
	} else {
		cero = '';
	}
	$("#timer").html("0"+min+" : "+cero+seg);
	if(seg!=0){
		seg=seg-1;}
	if(seg==0){
		if(min===seg){
			clearInterval(eliminarCandy);
			clearInterval(nuevosCandy);
			clearInterval(intervalo);
			clearInterval(tiempo);
			$(".panel-tablero").hide("drop","slow",finalJuego);
			$(".time").hide();
		}
		seg=59;
		min=min-1;
	}
};

// Funcion desaparecer piezas
function desaparecerPiezas(){
	matriz=0;
	buscarHoriz=horizontal();
	buscarVert=vertical();
	for(var j=1;j<8;j++){
		matriz=matriz+$(".col-"+j).children().length;
	}
	if(buscarHoriz==0 && buscarVert==0 && matriz!=49){
		clearInterval(eliminarCandy);
		buscarNewCandy=0;
		nuevosCandy=setInterval(function(){
			newCandy()
		},600);
	}
	if(buscarHoriz==1||buscarVert==1){
		$(".elemento").draggable({disabled:true});
		$("div[class^='col']").css("justify-content","flex-end");
		$(".activo").hide("pulsate",1000,function(){
			var scoretmp=$(".activo").length;
			$(".activo").remove("img");
			score=score+scoretmp*100;
			$("#score-text").html(score);
		});
	}
	if(buscarHoriz==0 && buscarVert==0 && matriz==49){
		$(".elemento").draggable({
			disabled:false,
			containment:".panel-tablero",
			revert:true,
			revertDuration:0,
			snap:".elemento",
			snapMode:"inner",
			snapTolerance:40,
			start:function(event,ui){
				mov=mov+1;
				$("#movimientos-text").html(mov);}
		});
	}
// Funcion mostrar nuevas piezas despues de 0.2 secs
	$(".elemento").droppable({
		drop:function (event,ui){
			var dropped=ui.draggable;
			var droppedOn=this;
			espera=0;
			do{
				espera=dropped.swap($(droppedOn));}
			while(espera==0);
			buscarHoriz=horizontal();
			buscarVert=vertical();
			if(buscarHoriz==0 && buscarVert==0){
				dropped.swap($(droppedOn));}
			if(buscarHoriz==1 || buscarVert==1){
				clearInterval(nuevosCandy);
				clearInterval(eliminarCandy);
				eliminarCandy=setInterval(function(){
					desaparecerPiezas()
				},200);}},
	});
};

jQuery.fn.swap=function(b){
	b=jQuery(b)[0];
	var a=this[0];
	var t=a.parentNode.insertBefore(document.createTextNode(''),a);
	b.parentNode.insertBefore(a,b);
	t.parentNode.insertBefore(b,t);
	t.parentNode.removeChild(t);
	return this;
};

// funcion para aparecer nuevos Candy
function newCandy(){
	$(".elemento").draggable({disabled:true});
	$("div[class^='col']").css("justify-content","flex-start")
	for(var j=1;j<8;j++){
		lencolum[j-1]=$(".col-"+j).children().length;
	}
	if(buscarNewCandy==0){
		for(var j=0;j<7;j++){
			lenrest[j]=(7-lencolum[j]);}
		maximo=Math.max.apply(null,lenrest);
		contaGen=maximo;
	}
	if(maximo!=0){
		if(buscarNewCandy==1){
			for(var j=1;j<8;j++){
				if(contaGen>(maximo-lenrest[j-1])){
					$(".col-"+j).children("img:nth-child("+(lenrest[j-1])+")").remove("img");}}
		}
		if(buscarNewCandy==0){
			buscarNewCandy=1;
			for(var k=1;k<8;k++){
				for(var j=0;j<(lenrest[k-1]-1);j++){
					$(".col-"+k).prepend("<img src='' class='elemento' style='visibility:hidden'/>");
				}
			}
		}
		for(var j=1;j<8;j++){
			if(contaGen>(maximo-lenrest[j-1])){
				numero=Math.floor(Math.random()*4)+1;
				imagen="image/"+numero+".png";
				$(".col-"+j).prepend("<img src="+imagen+" class='elemento'/>");
			}
		}
	}
	if(contaGen==1){
		clearInterval(nuevosCandy);
		eliminarCandy=setInterval(function(){
			desaparecerPiezas()
		},150);
	}
	contaGen=contaGen-1;
};

function horizontal(){
	var busHori=0;
	for(var j=1;j<8;j++){
		for(var k=1;k<6;k++){
			var res1=$(".col-"+k).children("img:nth-last-child("+j+")").attr("src");
			var res2=$(".col-"+(k+1)).children("img:nth-last-child("+j+")").attr("src");
			var res3=$(".col-"+(k+2)).children("img:nth-last-child("+j+")").attr("src");
			if((res1==res2) && (res2==res3) && (res1!=null) && (res2!=null) && (res3!=null)){
				$(".col-"+k).children("img:nth-last-child("+(j)+")").attr("class","elemento activo");
				$(".col-"+(k+1)).children("img:nth-last-child("+(j)+")").attr("class","elemento activo");
				$(".col-"+(k+2)).children("img:nth-last-child("+(j)+")").attr("class","elemento activo");
				busHori=1;
			}
		}
	}
	return busHori;
};

function vertical(){
	var busVerti=0;
	for(var l=1;l<6;l++){
		for(var k=1;k<8;k++){
			var res1=$(".col-"+k).children("img:nth-child("+l+")").attr("src");
			var res2=$(".col-"+k).children("img:nth-child("+(l+1)+")").attr("src");
			var res3=$(".col-"+k).children("img:nth-child("+(l+2)+")").attr("src");
			if((res1==res2) && (res2==res3) && (res1!=null) && (res2!=null) && (res3!=null)){
				$(".col-"+k).children("img:nth-child("+(l)+")").attr("class","elemento activo");
				$(".col-"+k).children("img:nth-child("+(l+1)+")").attr("class","elemento activo");
				$(".col-"+k).children("img:nth-child("+(l+2)+")").attr("class","elemento activo");
				busVerti=1;
			}
		}
	}
	return busVerti;
};

// Cambio de tablero a resultados
function finalJuego(){
	$(".panel-score").animate({width:'100%'},3000);
	$(".termino").css({"display":"block","text-align":"center"});
};

$(function(){
  juegoDulces.animacionTitulo();
});