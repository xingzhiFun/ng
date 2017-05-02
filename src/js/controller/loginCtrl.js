angular.module("app").controller("loginCtrl",["$http","$state","cache","$scope",function ($http,$state,cache,$scope) {
	$scope.submit = function () {
		$http.post("data/login.json",$scope.user)
			.then(function (res) {
				cache.put('login.id',res.data.id);
				cache.put('login.name',res.data.name);
				cache.put('login.image',res.data.image);
				$state.go('main');
			})
	}
}])