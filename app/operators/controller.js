import Ember from 'ember';
import mapBboxController from 'mobility-playground/mixins/map-bbox-controller';

export default Ember.Controller.extend(mapBboxController, {
	queryParams: ['bbox', 'onestop_id','pin'],
	pin: null,
	pinLocation: Ember.computed('pin', function(){
    if (typeof(this.get('pin'))==="string"){
      var pinArray = this.get('pin').split(',');
      return pinArray;
    } else {
      return this.get('pin');
    }
	}),
	bbox: null,
	leafletBbox: [[37.706911598228466, -122.54287719726562],[37.84259697150785, -122.29568481445312]],
	queryIsInactive: false,
  currentlyLoading: Ember.inject.service(),
	onestop_id: null,
	selectedOperator: null,
	hoverOperator: null,
	place: null,
	placeholderMessage: Ember.computed('leafletBbox', function(){
		var total = this.model.get('meta.total');
		if (total > 1){
			return  total + " operators";
		} else if (total === 1) {
			return total + " operator"
		}
	}),
	onlyOperator: Ember.computed('onestop_id', function(){
		var data = this.get('operators');
		var onlyOperator = data.get('firstObject');
		if (this.get('onestop_id') === null){
			return null
		} else {
			return onlyOperator;
		}
	}),
	icon: L.icon({
		iconUrl: 'assets/images/marker.png',		
		iconSize: (20, 20),
    iconAnchor: [10, 24],
	}),
	operators: Ember.computed('model', function(){
		if (this.get('model') === null){
			return
		} else {
			var data = this.get('model');
			var operators = [];
			operators = operators.concat(data.map(function(operator){return operator;}));
			return operators;
		}	
	}),
	mapMoved: false,
	mousedOver: false,
	actions: {
		setOperator(operator){
			var onestop_id = operator.get('id');
			this.set('onestop_id', onestop_id);
			this.set('selectedOperator', operator);
		},
		updateLeafletBbox(e) {
			var leafletBounds = e.target.getBounds();
			this.set('leafletBbox', leafletBounds.toBBoxString());
		},
		updatebbox(e) {
			var bounds = this.get('leafletBbox');
			this.set('bbox', bounds);
			this.set('mapMoved', false);
		},
		updateMapMoved(){
			if (this.get('mousedOver') === true){
				this.set('mapMoved', true);
			}
		},
		mouseOver(){
			this.set('mousedOver', true);
		},
		setOnestopId(operator) {
			var onestopId = operator.id;
			this.set('onestop_id', onestopId);
			this.set('selectedOperator', operator);
		},
		selectOperator(operator){
			this.set('selectedOperator', null);
			operator.set('operator_path_opacity', 1);
			operator.set('operator_path_weight', 3);
			this.set('hoverOperator', operator);
		},
		unselectOperator(operator){
			operator.set('operator_path_opacity', 0.5);
			operator.set('operator_path_weight', 1.5);
			this.set('hoverOperator', null);
		},
		searchRepo(term) {
      if (Ember.isBlank(term)) { return []; }
      const url = `https://search.mapzen.com/v1/autocomplete?api_key=search-ab7NChg&sources=wof&text=${term}`;
      return Ember.$.ajax({ url }).then(json => json.features);
    },
   	setPlace: function(selected){
      if (selected.geometry){
        var lng = selected.geometry.coordinates[0];
        var lat = selected.geometry.coordinates[1];
        var coordinates = [];
        coordinates.push(lat);
        coordinates.push(lng);
        this.set('mapCenter', coordinates); 
        this.set('pin', coordinates);
      }
  		this.set('place', selected);
  		this.transitionToRoute('index', {queryParams: {bbox: this.get('bbox'), pin: this.get('pin')}});
  	},
  	clearPlace(){
  		this.set('place', null);
  	},
  	removePin: function(){
      this.set('pin', null);
    },
  	dropPin: function(e){
      console.log(e.latlng);
      var lat = e.latlng.lat;
      var lng = e.latlng.lng;
      var coordinates = [];
      coordinates.push(lat);
      coordinates.push(lng);
      this.set('mapCenter', coordinates); 
      this.set('pin', coordinates);
    }
	}	
});