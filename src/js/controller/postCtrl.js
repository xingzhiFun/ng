angular.module("app").controller("postCtrl",["$http","$scope",function ($http,$scope) {
	$scope.itemList = [{
		id:'all',
		name:'全部'
	},{
		id:'pass',
		name:'面试邀请'
	},{
		id:'fail',
		name:'不合适'
	}];

	$http.get("data/myPost.json").then(function (resp) {
		$scope.list = resp.data;
	})

  	$scope.filterObj = {};
  	$scope.itemClick = function (id,name){
  		switch(id){
  			case 'all':
  				delete $scope.filterObj.state;
  				break;
  			case 'pass':
  				$scope.filterObj.state = '1';
  				break;
  			case 'fail':
  				$scope.filterObj.state = '-1';
  				break;
  		}
  	}
}])