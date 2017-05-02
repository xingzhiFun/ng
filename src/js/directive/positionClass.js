angular.module("app").directive("appPositionClass",[function () {
	return {
		restrict:'A',
		replace:true,
		scope:{
			comp:'='
		},
		templateUrl:'view/template/positionClass.html',
		link:function ($scope) {
			$scope.showPosition = function (idx) {
				$scope.positionList = $scope.comp.positionClass[idx].positionList;
				$scope.isActive = idx;
			}
			
			$scope.$watch("comp",function (nowVal) {
				if(nowVal){
					$scope.showPosition(0);
				}
			})
			
		}
	}
}])
