/* **************************************
 *                Config
 ****************************************/
//全局变量 .value
angular.module("app").value("dict",{}).run(["dict","$http",function (dict,$http) {
	$http.get("data/city.json").then(function (result) {
		dict.city = result.data;
	});
	$http.get("data/salary.json").then(function (result) {
		dict.salary = result.data;
	});
	$http.get("data/scale.json").then(function (result) {
		dict.scale = result.data;
	})
}])
