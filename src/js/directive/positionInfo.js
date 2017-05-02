angular.module("app").directive("appPositionInfo",[function () {
	return {
		restrict:'A',
		replace:true,
		templateUrl:'view/template/positionInfo.html',
		scope:{
			isActive:'=',
			isLogin:'=',
			pos:'='
		},
		link:function ($scope) {
			$scope.$watch("pos",function (newVal) {
				if(newVal){
					$scope.pos.select = $scope.pos.select || false;
					$scope.imgPath = $scope.pos.select ? "images/star-active.png" : "images/star.png";
				}
			})
			$scope.favorite = function (pos) {
				//发请求到后端
				$scope.pos.select = !$scope.pos.select;
				$scope.imgPath = $scope.pos.select ? "images/star-active.png" : "images/star.png";
			}		
		}
	}
}])
