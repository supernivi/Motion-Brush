var shades ={
	simplefs:
    	"precision mediump float;\n\
    	varying vec4 vColor;\n\
    	varying vec2 tc;\n\
		uniform sampler2D tex0;\n\
		uniform sampler2D tex1;\n\
		uniform float usetex;\n\
		\n\
    	void main(void) {\n\
    		vec4 tt = texture2D(tex0,tc);\n\
        	gl_FragColor = vec4(mix(vec3(1.),tt.rgb,usetex)*vColor.rgb*vec3(tt.a*vColor.a),vColor.a*tt.a);\n\
    	}",
	simplevs:
	    "attribute vec3 pos;\n\
	    attribute vec4 color;\n\
	    attribute vec2 texcoord;\n\
	    \n\
	    uniform vec2 tscale;\n\
	    uniform vec2 toffset;\n\
	    uniform vec2 pscale;\n\
	    uniform vec2 ptranslate;\n\
	    uniform vec4 pcolor;\n\
		\n\
    	varying vec4 vColor;\n\
    	varying vec2 tc;\n\
		\n\
    	void main(void) {\n\
        	gl_Position = vec4(pos*vec3(pscale.xy,1.)+vec3(ptranslate.xy,0.),1.);\n\
        	vColor = color*pcolor;\n\
        	vec2 ttt = ((texcoord*2.-vec2(1.))*tscale+toffset)*0.5+vec2(0.5);\n\
        	tc= ttt;\n\
    	}",
    particlevs:
	    "attribute vec3 pos;\n\
	    attribute vec4 color;\n\
	    attribute vec2 texcoord;\n\
	    \n\
	    uniform vec2 pscale;\n\
	    uniform vec2 ptranslate;\n\
	    uniform vec4 pcolor;\n\
		\n\
    	varying vec4 vColor;\n\
    	varying vec2 tc;\n\
		\n\
    	void main(void) {\n\
        	gl_Position = vec4(pos*vec3(pscale.xy,1.)+vec3(ptranslate.xy,0.),1.);\n\
        	vColor = color*pcolor;\n\
        	tc= texcoord;\n\
    	}",
    	
	 gaussvs:
	 	"attribute vec3 pos;\n\
     	attribute vec4 color;\n\
     	attribute vec2 texcoord;\n\
     	uniform vec2 width;\n\
		varying vec2 texcoordM;\n\
		varying vec2 texcoordB0;\n\
		varying vec2 texcoordF0;\n\
		varying vec2 texcoordB1;\n\
		varying vec2 texcoordF1;\n\
		varying vec2 texcoordB2;\n\
		varying vec2 texcoordF2;\n\
		varying vec4 vColor;\n\
		\n\
		void main(void){\n\
			gl_Position = vec4(pos,1);\n\
			texcoordM = texcoord;\n\
    		texcoordB0 = texcoord - width;\n\
    		texcoordF0 = texcoord + width;\n\
    		texcoordB1 = texcoord - width * 2.0;\n\
    		texcoordF1 = texcoord + width * 2.0;\n\
    		texcoordB2 = texcoord - width * 3.0;\n\
    		texcoordF2 = texcoord + width * 3.0;\n\
    		vColor=color;\n\
		}",
     basevs:
     	"attribute vec3 pos;\n\
     	attribute vec4 color;\n\
     	attribute vec2 texcoord;\n\
     	varying vec4 vColor;\n\
     	varying vec2 tc;\n\
     	\n\
     	void main(void){\n\
     		gl_Position = vec4(pos,1);\n\
     		tc = texcoord;\n\
     		vColor = color;\n\
     	}",
     basefs:
    	"precision mediump float;\n\
    	varying vec4 vColor;\n\
    	varying vec2 tc;\n\
		uniform sampler2D tex0;\n\
		uniform sampler2D tex1;\n\
		\n\
    	void main(void) {\n\
        	gl_FragColor = texture2D(tex0,tc);\n\
    	}",
     xfadefs:
    	"precision mediump float;\n\
    	varying vec4 vColor;\n\
    	varying vec2 tc;\n\
		uniform sampler2D tex0;\n\
		uniform sampler2D tex1;\n\
		uniform float xfade;\n\
		\n\
    	void main(void) {\n\
        	gl_FragColor = mix(texture2D(tex0,tc),texture2D(tex1,tc),xfade);\n\
    	}",
     lumakeyfs:
     	"precision mediump float;\n\
     	uniform sampler2D tex0;\n\
     	uniform sampler2D tex1;\n\
     	varying vec2 tc;\n\
     	uniform float thresh;\n\
     	uniform float fade;\n\
     	const vec4 lumcoeff = vec4(0.299,0.587,0.114,0.);\n\
     	\n\
     	void main(void){\n\
     		vec4 a = texture2D(tex0,tc);\n\
     		vec4 b = texture2D(tex1,tc);\n\
     		float lum = dot(texture2D(tex0,tc),lumacoeff);\n\
     		lum = smoothstep(thresh-fade, thresh+fade,lum);\n\
     		gl_FragColor = mix(a,b,lum);\n\
     	}",     
     	rgbluma:
     	"precision mediump float;\n\
     	uniform sampler2D tex0;\n\
     	uniform sampler2D tex1;\n\
     	varying vec2 tc;\n\
     	uniform float feedback;\n\
     	const vec4 lumcoeff = vec4(0.299,0.587,0.114,0.);\n\
     	\n\
     	void main(void){\n\
     		vec4 a = mix(texture2D(tex0,tc),texture2D(tex1,tc),vec4(feedback));\n\
     		gl_FragColor = vec4(vec3(dot(a,lumcoeff)),1.);\n\
     	}",
     	hsflow:
     	"precision mediump float;\n\
		varying vec2 tc;\n\
		uniform sampler2D tex0;\n\
		uniform sampler2D tex1;\n\
		uniform vec2 scale;\n\
		uniform vec2 offset;\n\
		void main()\n\
		{   \n\
			vec4 a = texture2D(tex0, tc);\n\
			vec4 b = texture2D(tex1, tc);\n\
			vec2 x1 = vec2(offset.x,0.);\n\
			vec2 y1 = vec2(0.,offset.y);\n\
			vec4 curdif = b-a;\n\
			vec4 gradx = texture2D(tex1, tc+x1)-texture2D(tex1, tc-x1);\n\
			gradx += texture2D(tex0, tc+x1)-texture2D(tex0, tc-x1);\n\
			vec4 grady = texture2D(tex1, tc+y1)-texture2D(tex1, tc-y1);\n\
			grady += texture2D(tex0, tc+y1)-texture2D(tex0, tc-y1);\n\
			float gradmag1 = distance(gradx.r,grady.r);\n\
			float gradmag = mix(gradmag1,0.00000000000001,float(gradmag1==0.));\n\
			//float vxd = curdif.x*(gradx.x/gradmag);\n\
			float vxd = curdif.x*(gradx.x);\n\
			vec2 xout = vec2(max(vxd,0.),abs(min(vxd,0.)))*scale.x;\n\
			//float vyd = curdif.x*(grady.x/gradmag);\n\
			float vyd = curdif.x*(grady.x);\n\
			vec2 yout = vec2(max(vyd,0.),abs(min(vyd,0.)))*scale.y;\n\
			vec4 pout = vec4(xout.xy,yout.xy);\n\
			//float within = float(abs(length(vec2(vxd,vyd)))<1.)*float(abs(length(vec2(vxd,vyd)))>0.);\n\
			gl_FragColor = mix(pout,vec4(0.),float(gradmag1==0.));\n\
		}",
		flowrepos:
		"precision mediump float;\n\
		//setup for 2 texture\n\
		varying vec2 tc;\n\
		uniform vec2 amt;\n\
		uniform vec2 pixels;\n\
		uniform vec2 boundmode;\n\
		uniform sampler2D tex0;\n\
		uniform sampler2D tex1;\n\
		\n\
		\n\
		void main()\n\
		{\n\
		vec2 pix = pixels*0.5;\n\
		vec2 pcord = floor(tc*pixels)/pixels;\n\
  	  	vec4 look = texture2D(tex1,pcord);//sample repos texture\n\
  	  	//vec4 look = texture2D(tex1,tc);//sample repos texture\n\
    	vec2 offs = (look.yw-look.xz)*amt;\n\
    	vec2 coord = offs+tc;//relative coordinates\n\
    	vec4 repos = texture2D(tex0,coord);\n\
    	\n\
    	// output texture\n\
    	gl_FragColor = repos;\n\
		}" ,
		slide:
		"precision mediump float;\n\
		uniform float slide;\n\
		uniform float offset;\n\
			varying vec2 tc;\n\
			uniform sampler2D tex0;\n\
			uniform sampler2D tex1;\n\
			\n\
			void main(void)\n\
			{\n\
			vec4 input0 = texture2D(tex0,tc);\n\
			vec4 input1 = texture2D(tex1,tc);\n\
			float d = max(1.0, abs(slide));\n\
			vec4 sd = vec4(1.0 / d);\n\
			gl_FragColor = input1 + ((input0 - input1) * sd);\n\
			}",
		adds:
		"precision mediump float;\n\
			uniform float diff;\n\
			varying vec2 tc;\n\
			uniform sampler2D tex0;\n\
			uniform sampler2D tex1;\n\
			uniform sampler2D tex2;\n\
		void main( void ){\n\
			vec4 v0 = texture2D(tex2, tc)-texture2D(tex1, tc);\n\
			vec4 v1 = texture2D(tex0, tc);\n\
			vec4 result = v0*vec4(diff) + v1;\n\
			gl_FragColor = vec4(result.rgb,1.);\n\
		}",
		testfs:
    	"precision mediump float;\n\
    	varying vec4 vColor;\n\
    	varying vec2 tc;\n\
		//uniform sampler2D tex0;\n\
		//uniform sampler2D tex1;\n\
		\n\
    	void main(void) {\n\
        	gl_FragColor = vColor;\n\
    	}",
    	cross:
    	"precision mediump float;\n\
    	varying vec2 tc;\n\
		uniform sampler2D tex0;\n\
		uniform float offset;\n\
		\n\
    	void main(void) {\n\
    		vec4 input0 = texture2D(tex0,tc);\n\
			vec2 x1 = vec2(offset,0.);\n\
			vec2 y1 = vec2(0.,offset);\n\
			input0 += texture2D(tex0,tc+x1);\n\
			input0 += texture2D(tex0,tc-x1);\n\
			input0 += texture2D(tex0,tc+y1);\n\
			input0 += texture2D(tex0,tc-y1);\n\
        	gl_FragColor = input0*vec4(0.2);\n\
    	}",
    	flowcomp:
    	"precision mediump float;\n\
			uniform float thresh;\n\
			varying vec2 tc;\n\
			uniform vec2 pixels;\n\
			uniform sampler2D tex0;\n\
			uniform sampler2D tex1;\n\
			uniform sampler2D tex2;\n\
		void main( void ){\n\
			vec2 pix = pixels*0.5;\n\
			vec2 pcord = floor(tc*pixels)/pixels;\n\
			vec4 v0 = texture2D(tex2,pcord);\n\
			float offs = dot((v0.yw+v0.xz),vec2(0.5,0.5));\n\
			vec4 v1 = mix(texture2D(tex1, tc),texture2D(tex0,tc),step(offs,thresh));\n\
			gl_FragColor = vec4(v1.rgb,1.);\n\
		}",
		bossr:
		"precision mediump float;\n\
			varying vec2 tc;\n\
			uniform vec4 LC;\n\
			uniform float hscale;\n\
			uniform float nscale;\n\
			uniform vec2 offset;\n\
			uniform vec3 lightpos;\n\
			uniform float fground;\n\
			uniform float dthresh;\n\
			uniform float dfade;\n\
			uniform float aspect;\n\
			uniform sampler2D tex0;\n\
			uniform sampler2D tex1;\n\
		void main( void ){\n\
			vec2 offs = tc+offset*vec2(1.,-1.);\n\
			float map0 = texture2D(tex1,tc).r*hscale;\n\
			float map1 = texture2D(tex1,vec2(offs.x,tc.y)).r*hscale-map0;\n\
			float map2 = texture2D(tex1,vec2(tc.x,offs.y)).r*hscale-map0;\n\
			vec3 shape = normalize(cross(vec3(1.,0.,map1),vec3(0.,1.,map2)));\n\
			vec3 light = normalize(lightpos-vec3((tc*vec2(2.)-vec2(1.))*vec2(1,aspect),(map0/hscale)*-nscale));\n\
			float greyval = clamp(dot(light,shape),0.,1.);\n\
			vec4 ic = texture2D(tex0,tc);\n\
			vec4 fc = mix(mix(LC*greyval,LC*ic*greyval,fground),ic,smoothstep(dthresh-dfade,dthresh+dfade,greyval));\n\
			gl_FragColor = vec4(fc.rgb,1.);\n\
			}",
		colorshift:
    	"precision mediump float;\n\
    	\n\
    	vec3 rgb2hsv(vec3 c){\n\
    		vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);\n\
    		vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));\n\
    		vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));\n\
    		float d = q.x - min(q.w, q.y);\n\
    		float e = 1.0e-10;\n\
    		return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);\n\
		}\n\
		vec3 hsv2rgb(vec3 c){\n\
    		vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);\n\
    		vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);\n\
    		return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);\n\
		}\n\
		\n\
    	uniform float hue;\n\
    	uniform float sat;\n\
    	uniform float lite;\n\
    	varying vec2 tc;\n\
		uniform sampler2D tex0;\n\
		\n\
    	void main(void) {\n\
    		vec4 textureColor = texture2D(tex0, tc);\n\
    		vec3 fragRGB = textureColor.rgb;\n\
    		vec3 fragHSV = rgb2hsv(fragRGB);\n\
			fragHSV.x += hue;\n\
    		fragHSV.y *= sat;\n\
    		fragHSV.z *= lite;\n\
    		fragHSV.x = mod(fragHSV.x, 1.0);\n\
    		fragRGB = hsv2rgb(fragHSV);\n\
    		gl_FragColor = vec4(fragRGB, textureColor.w);\n\
    	}",
    	gaussfs:
    	"precision mediump float;\n\
    	uniform sampler2D tex0;\n\
    	varying vec2 texcoordM;\n\
		varying vec2 texcoordB0;\n\
		varying vec2 texcoordF0;\n\
		varying vec2 texcoordB1;\n\
		varying vec2 texcoordF1;\n\
		varying vec2 texcoordB2;\n\
		varying vec2 texcoordF2;\n\
		\n\
		void main(){\n\
   			vec4 sampleM  = texture2D(tex0, texcoordM);\n\
    		vec4 sampleB0 = texture2D(tex0, texcoordB0);\n\
   			vec4 sampleF0 = texture2D(tex0, texcoordF0);\n\
    		vec4 sampleB1 = texture2D(tex0, texcoordB1);\n\
    		vec4 sampleF1 = texture2D(tex0, texcoordF1);\n\
    		vec4 sampleB2 = texture2D(tex0, texcoordB2);\n\
    		vec4 sampleF2 = texture2D(tex0, texcoordF2);\n\
			gl_FragColor = 0.1752 * sampleM + 0.1658 * (sampleB0 + sampleF0) + 0.1403 * (sampleB1 + sampleF1) + 0.1063 * (sampleB2 + sampleF2);\n\
		}",
		mostort:
		"precision mediump float;\n\
			uniform float amount;\n\
			varying vec2 tc;\n\
			uniform sampler2D tex0;\n\
			uniform sampler2D tex1;\n\
			\n\
			void main(void)\n\
			{\n\
			vec4 input1 = texture2D(tex1,tc);\n\
			vec4 input0 = texture2D(tex0,tc+vec2((input1.r-0.5)*amount,(input1.g-0.5)*amount));\n\
			gl_FragColor = input0;\n\
			}"
		,
		momask:
		"precision mediump float;\n\
			uniform float amount;\n\
			uniform float greymode;\n\
			varying vec2 tc;\n\
			uniform sampler2D tex0;\n\
			uniform sampler2D tex1;\n\
			\n\
			void main(void)\n\
			{\n\
			vec4 input1 = texture2D(tex1,tc);\n\
			vec4 input0 = texture2D(tex0,tc);\n\
			float mask = smoothstep(0.3,0.2,input1.b);\n\
			float grid = step(mod(tc.x*20.+20.,1.),0.95)*step(mod(tc.y*20.+20.,1.),0.95)*0.83+0.97;\n\
			gl_FragColor = mix(mix(input0,vec4(smoothstep(0.3,0.9,input0.g)),greymode),vec4(vec3(grid),1.),mask);\n\
			}"
		,
		mopaint:
		"precision highp float;\n\
			uniform float kill;\n\
			varying vec2 tc;\n\
			uniform sampler2D tex0;\n\
			\n\
			void main(void)\n\
			{\n\
			vec4 input0 = texture2D(tex0,tc);\n\
			gl_FragColor = mix(input0-vec4(0.,0.,0.0005,0.),vec4(0.5,0.5,0.0,1.0),kill);\n\
			}"
		
};
