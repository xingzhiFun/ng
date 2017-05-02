angular.module("app").controller("registerCtrl",["$http","$interval","$state","$scope",function ($http,$interval,$state,$scope) {
	$scope.submit = function () { //提交注册
		//http.js重写内置服务$http，模拟post请求拿到返回值
		$http.post('data/regist.json',$scope.user)
		.then(function (res) {
			alert("注册成功，无后台，请使用默认账号登录");
			$state.go('login');
		})
	}

	$scope.send = function () {//获取验证码
		var count = 60;
		$http.get('data/code.json')
			.then(function (result) {
				$scope.time = '60s';
				if(result.status == 200){
					var interval = $interval(function () {
						if(count <= 0){
							$interval.cancel(interval);
							$scope.time = "";
							return;
						}
						count--;
						$scope.time = count + 's';
					},1000)
				}
			})
	}
}])