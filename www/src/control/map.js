/*
 * veripeditus-web - Web frontend to the veripeditus server
 * Copyright (C) 2016  Dominik George <nik@naturalnet.de>
 * Copyright (C) 2016  Eike Tim Jesinghaus <eike@naturalnet.de>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

MapController = function() {
    // Set up map view
    this.map = L.map("map", {
        zoomControl: false,
        worldCopyJump: true
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    // Add initial marker for own position
    this.marker_self = L.marker([Device.position.coords.latitude, Device.position.coords.longitude]);
    this.marker_self.addTo(this.map);
    this.circle_self = L.circle(this.marker_self.getLatLng(), 0);
    this.circle_self.addTo(this.map);

    // Initially center map view to own position
    this.map.setView(this.marker_self.getLatLng(), 16);

    // Already created markers for gameobjects will be stored here.
    this.gameobject_markers = {};

    // Called by GameDataService on gameobjects update
    this.onUpdatedGameObjects = function() {
        // Iterate over gameobjects and add map markers
        for (id of Object.keys(GameData.gameobjects)) {
            var gameobject = GameData.gameobjects[id];

            // Check whether item should be shown on the map
            if (! gameobject.isonmap) {
                continue;
            }

            // Look for already created marker for this gameobject id
            var marker = this.gameobject_markers[gameobject.id];
            if (marker) {
                // Marker exists, store location
                marker.setLatLng([gameobject.latitude, gameobject.longitude]);
            } else {
                // Marker does not exist
                // Construct marker icon from gameobject image
                var icon = L.icon({
                    'iconUrl': '/api/gameobject/' + gameobject.id + '/image_raw',
                    'iconSize': [32, 32],
                });

                // Create marker at gameobject location
                marker = L.marker([gameobject.latitude, gameobject.longitude], {
                    'icon': icon
                });

                // Create popup
                var html = "<h1>" + gameobject.name + "</h1>";
                html += "<p class='map_popup_image'><img src='/api/gameobject/" + gameobject.id + "/image_raw' /></p>";
                if (gameobject.gameobject_type == "gameobject_item") {
                    html += "<button class='map_popup_button' onClick='GameData.item_collect(" + gameobject.id + ")'>Collect</button>";
                }
                marker.bindPopup(html);

                // Add marker to map and store to known markers
                marker.addTo(this.map);
                this.gameobject_markers[gameobject.id] = marker;
            }
        }
    };

    // Called by DeviceService on geolocation update
    this.onGeolocationChanged = function() {
        // Update position of own marker
        this.marker_self.setLatLng([Device.position.coords.latitude, Device.position.coords.longitude]);

        // Update accuracy radius around own marker
        this.circle_self.setLatLng(this.marker_self.getLatLng());
        this.circle_self.setRadius(Device.position.coords.accuracy);

        // Center map at own marker
        this.map.setView(this.marker_self.getLatLng());
    };

    // Subscribe to event on change of map view
    this.map.on('moveend', function(event) {
        // Update view bounds in GameDataService
        var bounds = event.target.getBounds();
        GameData.setBounds([bounds.getSouth(), bounds.getWest()], [bounds.getNorth(), bounds.getEast()]);
    });

    // Initially set bounds in GameDataService
    var bounds = this.map.getBounds();
    GameData.setBounds([bounds.getSouth(), bounds.getWest()], [bounds.getNorth(), bounds.getEast()]);
};

// Instantiate controller and register to services
MapView = new MapController();
Veripeditus.registerView(MapView);
