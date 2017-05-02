
angular.module("app").directive("appFoot",["cache","$state",function (cache,$state) {
	return {
		restrict:'A',
		replace:true,
		templateUrl:'view/template/foot.html'
	}
}])