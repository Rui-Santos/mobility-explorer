import Ember from 'ember';
import DS from 'ember-data';

var Operator = DS.Model.extend({
	identifiers: DS.attr(),
	imported_from_feed_onestop_ids: DS.attr('string'),
	name: DS.attr('string'),
	short_name: DS.attr('string'),
	onestop_id: Ember.computed.alias('id'),
	tags: DS.attr(),
	website: DS.attr('string'),
	country: DS.attr('string'),
	state: DS.attr('string'),
	metro: DS.attr('string'),
	timezone: DS.attr('string'),
	created_at: DS.attr('date'),
	updated_at: DS.attr('date'),
	geometry: DS.attr(),
	represented_in_feed_onestop_ids: DS.attr(),
	location: (function(){
		var coordinates = this.get('geometry')['coordinates'][0];
		var coordinatesLength = coordinates.length;
		var reversedCoordArray = [];
		for (var i = 0; i < coordinatesLength; i++){
			var tempCoord = null;
			var lat = this.get('geometry')['coordinates'][0][i][0];
			var lon = this.get('geometry')['coordinates'][0][i][1];
			tempCoord = lat;
			lat = lon;
			lon = tempCoord;
			var coordArray = [];
			coordArray.push(lat);
			coordArray.push(lon);
			reversedCoordArray.push(coordArray);
		}
		return reversedCoordArray;
	}).property('geometry')
});

export default Operator;


