    	var c = document.getElementById('c');
		c.width = $('#c').width();
		c.height = $('#c').height();
		c.aspect = $('#c').width()/$('#c').height();
		var fcount = 0,pcount=0;
		var gl,program,cBB,camtex,grad,brush,softbrush;
		var simpvs,basevs,basefs,xfadefs,shiftfs,testfs;
		var mostfs,moster;
		var ppgm, spgm,feedback,shift,xfade,tester;
		var particle,partvs,partfs,mote,moptfs,motefb,momask,mmpgm;
		var mmx = 0;
		var mmy = 0;
		var pmmx = 0;
		var pmmy = 0;
		var mouseframe = {'x':0,'y':0};
		var mouseprev = {'x':0,'y':0};
		var greymodechange = 0;
		var greymode = false;
		var regular = true;
		initGL();
		initSlabs();
		initImages();
		resizeCanvas();
		animate();	
		
    	function initGL(){
    		gl = c.getContext('experimental-webgl', { alpha: false });
    		gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
    		gl.disable(gl.BLEND);
    		gl.disable(gl.DEPTH_TEST);
    		gl.clearColor(0.,0.,0.,0.);
			gl.viewport(0,0,c.width,c.height);
			grad = new gradientTri(2);
			brush = new pxPbrush();
			brush.addColor(250,209,184,0.2);
			partvs = pxShader(shades.particlevs,gl.VERTEX_SHADER);
			partfs = pxShader(shades.simplefs,gl.FRAGMENT_SHADER);
			particle = pxProgram(partvs,partfs);
			gl.useProgram(particle);
  			gl.uniform1f(gl.getUniformLocation(particle,"usetex"),1);
  			brush.pgmscale = gl.getUniformLocation(particle,"pscale");
  			brush.pgmtranslate = gl.getUniformLocation(particle,"ptranslate");
  			brush.pgmcolor = gl.getUniformLocation(particle,"pcolor");
  			brush.scale = 0.0;

			softbrush = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, softbrush);
  			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    		softbrush.image = document.createElement('img');		
			softbrush.image.src = "images/softbrush2.png";
			softbrush.image.onload = function(){
				gl.bindTexture(gl.TEXTURE_2D, softbrush);
   				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, softbrush.image);
			}
		}
		
		function initSlabs(){
			cBB = new pxBB();//blank all purpose quad
			simpvs = pxShader(shades.simplevs,gl.VERTEX_SHADER);
			basevs = pxShader(shades.basevs,gl.VERTEX_SHADER);//basic vertex shader
			basefs = pxShader(shades.basefs,gl.FRAGMENT_SHADER);//basic frag shader
			testfs = pxShader(shades.testfs,gl.FRAGMENT_SHADER);
			mostfs = pxShader(shades.mostort,gl.FRAGMENT_SHADER);//distort!
			moptfs = pxShader(shades.mopaint,gl.FRAGMENT_SHADER);
			momask = pxShader(shades.momask,gl.FRAGMENT_SHADER);
			moster = new pxSlab(basevs,mostfs);
			moster.allocate(c.width,c.height);
			mote = new pxSlab(basevs,moptfs);//buffer for motion image
			mote.allocate2(c.width,c.height);
			motefb = new pxFBO();
			motefb.allocate2(c.width,c.height);
			shift = new pxFBO();
			shift.allocate(c.width,c.height);
			ppgm = pxProgram(basevs,basefs); //pass-through shader program
			mmpgm = pxProgram(basevs,momask);
			tester = pxProgram(basevs,testfs);//no texture shader
			gl.useProgram(moster.pgm);
			gl.uniform1f(gl.getUniformLocation(moster.pgm,"amount"),0.08);
			gl.useProgram(mote.pgm);
			gl.uniform1f(gl.getUniformLocation(mote.pgm,"kill"),1.0);
			gl.useProgram(mmpgm);
			gl.uniform1f(gl.getUniformLocation(mmpgm,"greymode"),0.);
		}
		
		function initImages(){
			moster.start();
			gl.clear(gl.COLOR_BUFFER_BIT);
				grad.draw(tester,mote.texture);
				grad.gen();
				grad.draw(tester,mote.texture);
				grad.gen();
				grad.draw(tester,mote.texture);
				grad.gen();
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		}
		
		function animate() {
			window.requestAnimFrame( animate );
			mouseframe.x = mmx;
			mouseframe.y = mmy;
			mouseprev.x = pmmx;
			mouseprev.y = pmmy;
			
		
			gl.clear(gl.COLOR_BUFFER_BIT);
			
			mote.start();
			gl.clear(gl.COLOR_BUFFER_BIT);
			motefb.draw(ppgm);
			//brush.update();
			gl.enable(gl.BLEND);
			gl.useProgram(particle);
			brush.color = [0.5+(mouseprev.x-mouseframe.x)*5,0.5+(mouseprev.y-mouseframe.y)*5,1.0,1];
			//console.log(brush.color);
			brush.xt = mouseframe.x;
			brush.yt = mouseframe.y;
			//brush.scale = 0.05;
			brush.draw(particle,softbrush);
			gl.disable(gl.BLEND);
			
			motefb.start();
			mote.draw(mote.pgm);
			gl.uniform1f(gl.getUniformLocation(mote.pgm,"kill"),0.00);
			
			
			shift.start();
			gl.clear(gl.COLOR_BUFFER_BIT);
			moster.draw2(moster.pgm,mote.texture);
	
			//draw to feedback
			moster.start();
			shift.draw(ppgm);
			if (pcount = 0){
				grad.draw(tester,mote.texture);
				grad.gen();
				grad.draw(tester,mote.texture);
				grad.gen();
				grad.draw(tester,mote.texture);
				grad.gen();
				pcount++;
			}
			if(Math.random()>0.98){
				grad.draw(tester,mote.texture);
				grad.gen();
			}
			
			if(greymodechange != 0){
				if(greymodechange == 1){
					gl.useProgram(mmpgm);
					gl.uniform1f(gl.getUniformLocation(mmpgm,"greymode"),1.);
					greymodechange = 0;
				}
				else if (greymodechange == -1) {
					gl.useProgram(mmpgm);
					gl.uniform1f(gl.getUniformLocation(mmpgm,"greymode"),0.);
					greymodechange = 0;
				}
			}
			
			//draw to screen
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			gl.clear(gl.COLOR_BUFFER_BIT);
			if(regular){
				shift.draw2(mmpgm,mote.texture);
			}
			else motefb.draw(ppgm);
		}
		
		$(document).ready(function(){
			$('canvas').mousedown(function(e){
				e.preventDefault();
				brush.scale = 0.1;
				$(window).bind('mouseup',function(e){
					brush.scale = 0;
					$(window).unbind('mouseup');
				});
			});
			$(document).mousemove(function(e){
				e.preventDefault();
				pmmx = mmx;
				pmmy = mmy;
				mmx = (e.clientX/c.width)*2.-1;
				mmy = (e.clientY/c.height)*-2+1;
			});
    		$(document).bind('touchmove',function(e) {
    			e.preventDefault();
				var ev = e.originalEvent.touches[0];
				pmmx = mmx;
				pmmy = mmy;
				mmx = (ev.pageX/c.width)*2.-1;
				mmy = (ev.pageY/c.height)*-2+1;
   			});
   			$('canvas').bind('touchstart',function(e){
   				e.preventDefault();
				brush.scale = 0.1;
				$(window).bind('touchend',function(e){
					brush.scale = 0;
					$(window).unbind('touchend');
				});
			});
			$(document).keypress(function(e){
				if(e.which == '98'){
					if (greymode) greymode = false;
					else greymode = true;
					if (greymode) greymodechange = 1;
					else greymodechange = -1;
				}
				else if (e.which == '110'){
					regular = !regular;
				}
				//console.log(e.which);
			});
			
		});
