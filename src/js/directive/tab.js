angular.module("app").directive("appTab",function () {
	return {
		restrict:'A',
		replace:true,
		templateUrl:'view/template/tab.html',
		scope:{
			list:'=',
			xcli:'&'
		},
		link:function ($scope) {
			$scope.selectId = "city";
			$scope.click = function (item) {
				$scope.selectId = item.id;
				$scope.xcli(item);
			}
		}
	}
})
