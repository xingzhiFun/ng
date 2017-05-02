angular.module("app").directive("appHeadBar",[function () {
	return {
		restrict:'A',
		replace:true,
		templateUrl:'view/template/headBar.html',
		scope:{
			title:'@'//传字符串的不用 '=' ，用 '@' 
		},
		link:function ($scope) {
			$scope.back = function () {
				window.history.back();
			}
		}
	}
}])
