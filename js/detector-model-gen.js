function makePoint(array) {
	return {x: array[0], y: array[1], z: array[2]};
}

function makeDisc(ir, or, pos, slices) {
	var lines = [];
	var points = [];

	for (var i = 0; i < slices; i++) {
		var sa = Math.sin(i / slices * 2 * Math.PI);
		var ca = Math.cos(i / slices * 2 * Math.PI);
		
		points.push({x: ir * sa, y: ir * ca, z: pos});
		points.push({x: or * sa, y: or * ca, z: pos});
		
		var ix1 = i * 2;
		var ix2 = ((i + 1) % slices) * 2;
		
		lines.push({p1: ix1 + 0, p2: ix1 + 1});
		lines.push({p1: ix1 + 0, p2: ix2 + 0});
		lines.push({p1: ix1 + 1, p2: ix2 + 1});
	}
	
	return [points, lines];
}

function makeCylinder(r, len, pos, slices, segments) {
	var lines = [];
	var points = [];
	for (var s = 0; s < segments; s++) {
		for (var i = 0; i < slices; i++) {
			var sa = Math.sin(i / slices * 2 * Math.PI);
			var ca = Math.cos(i / slices * 2 * Math.PI);
			var p = s/(segments - 1) * len + pos;
			points.push({x: r * sa, y: r * ca, z: p});
			
			var ix1 = (s * slices + i);
			var ix2 = (s * slices + ((i + 1) % slices));
			
			lines.push({p1: ix1, p2: ix2});
			
			if (s > 0) {
				var ix3 = ((s - 1) * slices + i);
				lines.push({p1: ix3 + 0, p2: ix1 + 0});
			}
		}
	}
	
	return [points, lines];
}

function makeTube(ir, or, len, pos, slices, segments) {
	var lines = [];
	var points = [];

	for ( var s = 0; s < segments; s++ ) {
		for ( var i = 0; i < slices; i++ ) {
			var sa = Math.sin(i / slices * 2 * Math.PI);
			var ca = Math.cos(i / slices * 2 * Math.PI);
			var p = s/(segments - 1) * len + pos;
			points.push({x: ir * sa, y: ir * ca, z: p});
			points.push({x: or * sa, y: or * ca, z: p});
			
			var ix1 = (s * slices + i) * 2;
			var ix2 = (s * slices + ((i + 1) % slices)) * 2;
			
			lines.push({p1: ix1 + 0, p2: ix1 + 1});
			lines.push({p1: ix2 + 0, p2: ix2 + 1});
			lines.push({p1: ix1 + 0, p2: ix2 + 0});
			lines.push({p1: ix1 + 1, p2: ix2 + 1});
			
			if (s > 0) {
				var ix3 = ((s - 1) * slices + i) * 2;
				lines.push({p1: ix3 + 0, p2: ix1 + 0});
				lines.push({p1: ix3 + 1, p2: ix1 + 1});
			}
		}
	}
	
	return [points, lines];
}

function makeWireframe(data, descr) {
	var points = data[0];
	var lines = data[1];
	var wp = [];
	var wl = [];
	
	for (var i = 0; i < points.length; i++) {
		wp.push(makePoint(points[i]));
	}
	for (var i = 0; i < lines.length; i++) {
		wl.push({p1: lines[i][0], p2: lines[i][1]});
	}
	
	return [wp,wl];
}

function makeModelHcalForward(data, descr) {
	return [makeTube(0.15, 1.25, 1.7, 11.1, 24, 2), makeTube(0.15, 1.25, -1.7, -11.1, 24, 2)]; 
}

function makeModelHcalForwardPlus(data, descr) {
	return [makeTube(0.15, 1.25, 1.7, 11.1, 24, 2)];
}

function makeModelHcalForwardMinus(data, descr) {
	return [makeTube(0.15, 1.25, -1.7, -11.1, 24, 2)];
}

function makeModelHcalOuter(data, descr) {
	return [makeTube(3.9, 4.1, 3, -1.5, 48, 8), makeCylinder(4.2, 2.5, 1.5, 24, 7),
	        makeCylinder(4.2, 3, 4.1, 24, 6), makeCylinder(4.2, -2.5, -1.5, 24, 7),
	        makeCylinder(4.2, -3, -4.1, 24, 6)];
}

function makeModelHcalEndcap(data, descr) {
	var points = [];
	var lines = [];
	
	var or = 2.9;
	var ir = 0.4;
	
	var slices = 72;
	var len = 1.5;
	var pos = 4;
	
	var ori = pos / (pos + len) * or;
	var iro = (pos + len) / pos * ir;
	
	for (var i = 0; i < slices; i++) {
		var sa = Math.sin(i / slices * 2 * Math.PI);
		var ca = Math.cos(i / slices * 2 * Math.PI);
		
		points.push({x: ori * ca, y: ori * sa, z: pos});
		points.push({x: ir * ca, y: ir * sa, z: pos});
		points.push({x: or * ca, y: or * sa, z: pos + len});
		points.push({x: iro * ca, y: iro * sa, z: pos + len});
		
		points.push({x: ori * ca, y: ori * sa, z: -pos});
		points.push({x: ir * ca, y: ir * sa, z: -pos});
		points.push({x: or * ca, y: or * sa, z: -pos - len});
		points.push({x: iro * ca, y: iro * sa, z: -pos - len});
		
		var ix1 = i * 8;
		var ix2 = ((i + 1) % slices) * 8;
		
		//maybe this slice thing should be abstracted 
		//radial
		lines.push({p1: ix1 + 0, p2: ix1 + 1});
		lines.push({p1: ix1 + 2, p2: ix1 + 3});
		lines.push({p1: ix1 + 4, p2: ix1 + 5});
		lines.push({p1: ix1 + 6, p2: ix1 + 7});
		
		//tangential
		lines.push({p1: ix1 + 0, p2: ix2 + 0});
		lines.push({p1: ix1 + 1, p2: ix2 + 1});
		lines.push({p1: ix1 + 2, p2: ix2 + 2});
		lines.push({p1: ix1 + 3, p2: ix2 + 3});
		lines.push({p1: ix1 + 4, p2: ix2 + 4});
		lines.push({p1: ix1 + 5, p2: ix2 + 5});
		lines.push({p1: ix1 + 6, p2: ix2 + 6});
		lines.push({p1: ix1 + 7, p2: ix2 + 7});
		
		//well, still radial, but the other radius
		lines.push({p1: ix1 + 0, p2: ix1 + 2});
		lines.push({p1: ix1 + 4, p2: ix1 + 6});
	}
	
	return [[points, lines]];
}

function makeModelHcalBarrel(data, descr) {
	var points = [];
	var lines = [];
	
	var or = 2.9;
	var ir = 1.8;
	var slices = 72;
	var len = 5;
	var lslices = 20;
	
	var maxa = Math.atan(len / or);

	for (var pos = 0; pos <= lslices; pos++) {
		var a = pos / lslices * maxa;
		var po = or * Math.tan(a);
		var pi = ir * Math.tan(a);
		
		for (var i = 0; i < slices; i++) {
			var sa = Math.sin(i / slices * 2 * Math.PI);
			var ca = Math.cos(i / slices * 2 * Math.PI);
			
			points.push({x: or * ca, y: or * sa, z: po});
			points.push({x: ir * ca, y: ir * sa, z: pi});

			points.push({x: or * ca, y: or * sa, z: -po});
			points.push({x: ir * ca, y: ir * sa, z: -pi});
			
			var ix1 = (pos * slices + i) * 4;
			var ix2 = (pos * slices + ((i + 1) % slices)) * 4;
			
			//tan
			lines.push({p1: ix1 + 0, p2: ix2 + 0});
			lines.push({p1: ix1 + 1, p2: ix2 + 1});
			if (pos > 0) {
				lines.push({p1: ix1 + 2, p2: ix2 + 2});
				lines.push({p1: ix1 + 3, p2: ix2 + 3});
			}
			
			//rad
			lines.push({p1: ix1 + 0, p2: ix1 + 1});
			if (pos > 0) {
				lines.push({p1: ix1 + 2, p2: ix1 + 3});
			}

			//axial
			if (pos < lslices) {
				var ix3 = ((pos + 1) * slices + i) * 4;
				lines.push({p1: ix1 + 0, p2: ix3 + 0});
				lines.push({p1: ix1 + 2, p2: ix3 + 2});
			}
			
		}
	}
	
	return [[points, lines]];
}

//function makeTube(ir, or, len, pos, slices, segments) {
function makeModelEcalEndcapMinus(data, descr) {
	return [makeTube(0.35, 1.5, 0.05, 3.2, 24, 2)];
}

function makeModelEcalEndcapPlus(data, descr) {
	return [makeTube(0.35, 1.5, -0.05, -3.2, 24, 2)];
}

function makeModelEcalPreshower(data, descr) {
	return [makeDisc(0.4, 1.3, 3.025, 24), makeDisc(0.4, 1.3, 3.075, 24), 
	        makeDisc(0.4, 1.3, -3.025, 24), makeDisc(0.4, 1.3, -3.075, 24)]
}

function makeModelEcalBarrel(data, descr) {
	var hr = data[0];
	var pos = data[1];
	var fr = data[2];
	var hpos = data[3];
	var slices = 24;
	
	var points = [];
	var lines = [];
	
	
	for (var a = 0; a < slices; a++) {
		var sa = Math.sin(a / slices * 2 * Math.PI);
		var ca = Math.cos(a / slices * 2 * Math.PI);
		
		for (var i = 0; i < pos.length; i++) {
			points.push({x: hr * ca, y: hr * sa, z: hpos[i]});
		}
		for (var i = 0; i < pos.length; i++) {
			points.push({x: fr[i] * ca, y: fr[i] * sa, z: pos[i]});
		}
		
		for (var i = 0; i < pos.length; i++) {
			var so1 = a * pos.length * 2;
			var so2 = ((a + 1) % slices) * pos.length * 2;
			var ix1 = i; 
			if (i < pos.length - 1) {
				lines.push({p1: so1 + ix1, p2: so1 + ix1 + 1});
			}
			lines.push({p1: so1 + ix1, p2: so2 + ix1});
			
			var so1 = a * pos.length * 2;
			var so2 = ((a + 1) % slices) * pos.length * 2;
			var ix1 = i + pos.length;
			if (i < pos.length - 1) {
				lines.push({p1: so1 + ix1, p2: so1 + ix1 + 1});
			}
			lines.push({p1: so1 + ix1, p2: so2 + ix1});
		}
	}
	
	return [[points, lines]];
}

function makeModelTrackerBarrel(data, descr) {
	var radii = [0.046, 0.07, 0.1, 
	             0.24, 0.27, 0.32, 0.37, 0.40, 0.43, 0.47, 0.51, 
	             0.62, 0.70, 0.78, 0.88, 0.97, 1.08];
	var lengths = [0.53, 0.53, 0.53, 
	               1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 
	               2.18, 2.18, 2.18, 2.18, 2.18, 2.18];
	
	var slices = 24;
	var wfs = new Array();
	
	for (var i = 0; i < radii.length; i++) {
		var r = radii[i];
		var l = lengths[i];
		
		wfs.push(makeCylinder(r, l, -l / 2, slices, 2));
	}
	
	return wfs;

}

function makeModelTrackerEndcap(data, descr) {
	var ecradii =    [0.145, 0.145, 0.50, 0.47, 0.50, 0.47, 0.50, 0.47,
	                  1.08, 1.06, 1.08, 1.06, 1.08, 1.06, 1.08, 1.06, 1.08, 1.06, 1.08, 1.06,
	                  1.08, 1.06, 1.08, 1.06, 1.08, 1.06];
	var ecintradii = [0.07,  0.07,  0.40, 0.25, 0.40, 0.25, 0.40, 0.25,
	                  0.30, 0.30, 0.30, 0.30, 0.30, 0.30, 0.30, 0.30, 0.30, 0.30, 0.30, 0.30,
	                  0.30, 0.30, 0.30, 0.30, 0.30, 0.30];
	var ecpos =      [0.35,  0.48,  0.76, 0.83, 0.89, 0.96, 1.02, 1.09,
	                  1.27, 1.34, 1.41, 1.48, 1.55, 1.62, 1.69, 1.76, 1.83, 1.90, 2.00, 2.08,
	                  2.20, 2.28, 2.40, 2.48, 2.60, 2.68];

	var slices = 24;
	var wfs = new Array();
	
	for (var i = 0; i < ecradii.length; i++) {
		var ecro = ecradii[i];
		var ecri = ecintradii[i];
		var ecp = ecpos[i];
		
		wfs.push(makeDisc(ecri, ecro, ecp, slices));
		wfs.push(makeDisc(ecri, ecro, -ecp, slices));	
	}
	return wfs;
}

function makeRPC(data, descr) {
	var wfs = new Array();

	wfs.push(makeWireframe(data, descr));
	wfs.push(makeDisc(7, 3, 9.7, 36));
	wfs.push(makeDisc(7, 3, 7.9, 36));
	wfs.push(makeDisc(7, 3, 7.2, 36));
	wfs.push(makeDisc(7, 3, -9.7, 36));
	wfs.push(makeDisc(7, 3, -7.9, 36));
	wfs.push(makeDisc(7, 3, -7.2, 36));
	
	return wfs;
}

function makeShape(data, descr) {
	points = data[0];
	lines = data[1];
	shapes = [];

	var wfcolor = new THREE.Color();
  	wfcolor.setRGB(descr.color[0], descr.color[1], descr.color[2]); 
	var material = new THREE.LineBasicMaterial({color:wfcolor, linewidth:descr.lineWidth, opacity: descr.color[3]});

	for ( var i = 0; i < lines.length; i++ ) {
		var l = lines[i];
		var line = new THREE.Geometry();
		var p1 = points[l.p1];
		var p2 = points[l.p2];
		line.vertices.push(points[l.p1]);
		line.vertices.push(points[l.p2]);
		shapes.push(new THREE.Line(line,material));
	}

	shapes.forEach(function(s) {
		s.name = descr.key;
		s.visible = descr.on;
	});
	return shapes;
}