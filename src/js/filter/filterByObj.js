///* filter 搜索过滤
// * x in data | filterByObj : {id:'p1'}
// * 左边的数组对象为第一个参数，右边的对象为第2个参数
// */
angular.module("app").filter("filterByObj",[function () {
	return function (list,obj) {
		var result = [];
		angular.forEach(list,function (item) {
			var isEqual = true;
			for(var e in obj){
				if(item[e] !== obj[e]){
					isEqual = false;
				}
			}
			
			if(isEqual) {
				result.push(item);
			}
		});
		return result;
	}
}])