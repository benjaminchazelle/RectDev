//Chazelle Saugues
//Étudiants Lyon 1
//Licence CC BY-NC-SA

Array.prototype.get = function (index) {
	
	var i = parseInt(index) % this.length;

	if(i < 0)
		i += this.length;
	
	return this[i];
	
	}
	
function checkRightAngles(_polygon) {
	
	var collection = {};
	
	for(var i = 0, l = _polygon.length; i < l; i++) {
		
		var u = _polygon.get(i - 1);
		var v = _polygon.get(i);
		var w = _polygon.get(i + 1);
		
		if(v.x in collection) {
			if(v.y in collection[v.x])
				console.log("Erreur: plusieurs sommets en un même point");
			else
				collection[v.x][v.y] = true;
		}
		else {
			collection[v.x] = {};
			collection[v.x][v.y] = true;
		}

		if(!(u.y == v.y && v.x == w.x) && !(u.x == v.x && v.y == w.y)) {
		
			alert("Erreur: Angle non droit détécté");
		
			return false;
			}
		
		}
	
	return true;
	
	}
	
function optimizePolygon(_polygon) {
	
	var new_polygon = [];

	if(_polygon.length == 0)
		return new_polygon;

	var u = _polygon.get(0);
	new_polygon.push(u);

	for(var i = 1, l = _polygon.length; i < l; i++) {
		
		var v = _polygon.get(i);
		var w = _polygon.get(i + 1);

		if(!(u.x == v.x && v.x == w.x) && !(u.y == v.y && v.y == w.y)) {
			new_polygon.push(v);
			u = v;
			}

		}
	
	return new_polygon;
	}
	
	
function getTopLeftVertex(_polygon) {
	
	var topLeftVertex = _polygon.get(0);
	var topLeftVertex_index = 0;
	
	for(var i = 1, l = _polygon.length; i < l; i++) {
		
		var v = _polygon.get(i);
		
		if(v.y < topLeftVertex.y || (v.y == topLeftVertex.y && v.x < topLeftVertex.x)) {
			topLeftVertex = v;	
			topLeftVertex_index = i;
			}
		
		}
		
	return topLeftVertex_index;
	
	}
	
	
function setClockwiseDeclaration(_polygon) {
	
	topLeftVertex_index = getTopLeftVertex(_polygon);
	
	a = _polygon.get(topLeftVertex_index);
	b = _polygon.get(topLeftVertex_index + 1);
	
	if(a.x == b.x) {
		_polygon.reverse();
		return true;
		}
		
	return false;
			
	}	
	
	
function ChazelleSaugues(_polygon) {
	
	var e=0;

	_polygon = optimizePolygon(_polygon);
	
	if(_polygon.length < 4 || !checkRightAngles(_polygon))
		return [];
	
	setClockwiseDeclaration(_polygon);
		
	var progression = true;
	
	var sommet_courant = 0;

	var result = [];
	
	vertex_issue = _polygon.length;

	while (progression) {

		var a = _polygon.get(sommet_courant + 0);
		var b = _polygon.get(sommet_courant + 1);
		var c = _polygon.get(sommet_courant + 2);
		var d = _polygon.get(sommet_courant + 3);
		var e = _polygon.get(sommet_courant + 4);
		
		sommet_courant++;
		
		pattern_U	  = (b.y == c.y && (a.y < b.y && d.y < c.y) );
		pattern_U_inv = (b.y == c.y && (a.y > b.y && d.y > c.y) );
		
		pattern_C	  = (b.x == c.x && (a.x > b.x && d.x > c.x) );
		pattern_C_inv = (b.x == c.x && (a.x < b.x && d.x < c.x) );
		
		ab_sup_pattern_U = Math.abs(b.y-a.y) > Math.abs(d.y-c.y);
		ab_sup_pattern_C = Math.abs(b.x-a.x) > Math.abs(d.x-c.x);
		
		ab_eq_pattern_U = Math.abs(b.y-a.y) == Math.abs(d.y-c.y);
		ab_eq_pattern_C = Math.abs(b.x-a.x) == Math.abs(d.x-c.x);
		
		pattern_ok = pattern_U || pattern_U_inv || pattern_C || pattern_C_inv;
		
		if((pattern_U) && a.x < d.x)
			continue;
		if((pattern_U_inv) && a.x > d.x)
			continue;
		if((pattern_C) && a.y < d.y)
			continue;
		if((pattern_C_inv) && a.y > d.y)
			continue;
		
		//forme U
		if(pattern_U){
			
			if(ab_sup_pattern_U) {
				phi = {x : a.x, y : d.y};
				alpha = d;
				beta = b;
				}
			else {
				phi = {x : d.x, y : a.y};
				alpha = phi;
				beta = b;
				}
			}
			
		else if(pattern_U_inv) {
			
			if(ab_sup_pattern_U) {
				phi = {x : a.x, y : d.y};
				alpha = b;
				beta = d;
				}
			else {
				phi = {x : d.x, y : a.y};
				alpha = b;
				beta = phi;
				}
			}
		
		//forme C
		else if(pattern_C) {
			
			if(ab_sup_pattern_C) {
				phi = {x : d.x, y : a.y};
				alpha = c;
				beta = phi;
				}
			else {
				phi = {x : a.x, y : d.y};
				alpha = c;
				beta = a;
				}
			}
			
		else if(pattern_C_inv) {
			
			if(ab_sup_pattern_C) {
				phi = {x : d.x, y : a.y};
				alpha = phi;
				beta = c;
				}
			else {
				phi = {x : a.x, y : d.y};
				alpha = a;
				beta = c;
				}
			}
		
		
		//condition aucun point dans le rectangle a découper
		if(pattern_ok) {
			
			inner = false;
			
			for(i=0;i<_polygon.length;i++) {
			
				if(_polygon[i] == a || _polygon[i] == b || _polygon[i] == c || _polygon[i] == d || (_polygon[i] == e && a.x == e.x && a.y == e.y))
					continue;
					
				if(alpha.x <= _polygon[i].x && _polygon[i].x <= beta.x && alpha.y <= _polygon[i].y && _polygon[i].y <= beta.y ) {
					inner = true;
					break;	
					}
				}
				
				if(!inner){
				
					new_polygon = [];
					
					for(i=0;i<_polygon.length;i++) {
						
						if((pattern_U || pattern_U_inv)) {
							
							if(ab_sup_pattern_U) {
								
								if(_polygon[i] == b)
									new_polygon.push(phi);
								else if (_polygon[i] != c && _polygon[i] != d)
									new_polygon.push(_polygon[i]);
								
								}
							else if(ab_eq_pattern_U) {
								
								if (_polygon[i] != a && _polygon[i] != b && _polygon[i] != c && _polygon[i] != d)
										new_polygon.push(_polygon[i]);
								}
							else {
								
								if(_polygon[i] == a)
									new_polygon.push(phi);
								else if (_polygon[i] != b && _polygon[i] != c)
									new_polygon.push(_polygon[i]);
								}

							}
						else if((pattern_C || pattern_C_inv)) {
							
							
							
							if(ab_sup_pattern_C) {
								
								if(_polygon[i] == b)
									new_polygon.push(phi);
								else if (_polygon[i] != c && _polygon[i] != d)
									new_polygon.push(_polygon[i]);
								}
							else if(ab_eq_pattern_C) {
								
								if (_polygon[i] != a && _polygon[i] != b && _polygon[i] != c && _polygon[i] != d)
										new_polygon.push(_polygon[i]);
								}
							else {
								
								if(_polygon[i] == a)
									new_polygon.push(phi);
								else if (_polygon[i] != b && _polygon[i] != c)
									new_polygon.push(_polygon[i]);
								}

							}
						
						}
						
					result.push({"alpha": alpha, "beta": beta});
					
					_polygon = new_polygon;
					
					vertex_issue = _polygon.length;

					sommet_courant-=2;
					}
			}
		
		vertex_issue--;
		
		if(_polygon.length == 0 || vertex_issue < 0)
			progression = false;
		
		}

	return result;
	}
			