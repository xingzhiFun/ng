/* **************************************
 *             Controller
 ****************************************/
angular.module("app").controller("companyCtrl",['$http','$state','$scope',function ($http,$state,$scope) {
	$http.get('data/company.json?id=' + $state.params.id)
			.then(function (result) {
				$scope.company = result.data;
			})
			.catch(function (err) {
				console.log(err);
			})
}])
