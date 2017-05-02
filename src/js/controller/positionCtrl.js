angular.module("app").controller("positionCtrl",["$q","$http","$state","cache","$scope",function ($q,$http,$state,cache,$scope) {
	$scope.isLogin = cache.get("login.name") || "";
	$scope.message = $scope.isLogin ? '投个简历' : '登陆';
	function getPosition () {
		var def = $q.defer();
		$http.get('data/position.json?id=' + $state.params.id)
			.then(function (result) {
				$scope.position = result.data;
				
				if(result.data.posted){
					$scope.message = "已投递";
				}

				def.resolve(result.data);
			})
			.catch(function (err) {
				def.reject(err);
			})
		return def.promise;
	}
	
	function getCompany (id) {
		$http.get('data/company.json?id=' + id)
			.then(function (result) {
				$scope.company = result.data;
			})
			.catch(function (err) {
				console.log(err);
			})
	}
	getPosition().then(function (obj) {
		getCompany(obj.companyId);
	})


	$scope.go = function () {
		if($scope.message !== "已投递"){
			if($scope.isLogin){//已经登录
				//点击投个简历，发请求到后台
				$scope.message = "已投递";
			}else{
				$state.go("login");
			}
		}
	}
}])
