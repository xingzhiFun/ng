
angular.module("app").directive("appPositionList",[function () {
	return {
		restrict:'A',
		replace:true,
		templateUrl:'view/template/positionList.html',
		scope:{ //默认值为false
			data:'=',
      		filterObj: '=',
      		isFavorite: '='
		},
		link:function ($scope) {
			$scope.select = function (x) {
				x.select = !x.select;
			}
		}
	}
}])
