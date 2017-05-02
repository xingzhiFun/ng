// 因为本项目没有后台
// 重写angular的内置服务$http
// 模拟post请求，拿到返回值。
angular.module("app").config(["$provide",function ($provide) {
	$provide.decorator('$http',['$delegate','$q',function ($delegate,$q) {
		var get = $delegate.get;
		$delegate.post = function (url,data,config) {
			var def = $q.defer();
			get(url).then(function (result){
				def.resolve(result);
			}).catch(function (err) {
				def.reject(err);
			});
			return {
				then: function (cb) {
					def.promise.then(cb);
				},
				catch: function (cb) {
					def.promise.then(null,cb);
				}
			}
		}
		return $delegate;
	}])
}])