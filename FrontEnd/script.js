var app = angular.module('myApp', []);

//This is worth to read for async processing
//http://docs.angularjs.org/api/ng.$q
//You need to use $q, and $rootScope.$apply
app.service('GeoCoder', function($q, $rootScope) {
    return {
      getLocations : function(address) {
        var deferred = $q.defer();
        var geocoder = new google.maps.Geocoder();
        console.log('address', address);
        geocoder.geocode({'address': address }, function (results, status) {
          $rootScope.$apply(function() {
            if (status == google.maps.GeocoderStatus.OK) {
              console.log(results);
              deferred.resolve(results);
            }
          });
        });
        return deferred.promise;
      }
    }
});

app.controller('MyCtrl', function($scope, GeoCoder) {
  $scope.map; // this will be set by directive
  $scope.address = "Krusha Planina 56, Sofia";
  
  $scope.addMarkerFromAddress = function() {
    GeoCoder.getLocations($scope.address).then(function(results) {
      var latLng = results[0].geometry.location;
      console.log('Success: ' + location);
      var marker = new google.maps.Marker({
        map: $scope.map, 
        position: latLng
      });
      $scope.map.setCenter(latLng);
    });
  };
  
});

app.directive('map', function() {
  return {
    restrict: 'E',
    replace: true,
    template: '<div></div>',
    link: function (scope, element, attrs) {
      var map_options = {
        center: new google.maps.LatLng(40.294163, -3.7581804000000147),
        zoom: 8
      };
      var map = new google.maps.Map(element[0], map_options);
      scope.map = map;		
    }
  };
})
