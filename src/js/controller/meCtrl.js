angular.module("app").controller("meCtrl",["cache","$state","$scope",function (cache,$state,$scope) {
	if(cache.get('login.name')){
		$scope.name = cache.get('login.name');
		$scope.imgPath = cache.get('login.image');
	}else{
		// $state.go('login');
	}

	$scope.logout = function () {
		cache.remove('login.id');
		cache.remove('login.image');
		cache.remove('login.name');
		$state.go('main');
	}
}])