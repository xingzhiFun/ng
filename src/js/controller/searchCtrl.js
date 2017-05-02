angular.module("app").controller("searchCtrl",['dict','$http','$scope',function (dict,$http,$scope) {
	$scope.name = '';
	$scope.search = function () {
		$http.get('./data/positionList.json?name=' + $scope.name)
			.then(function (result) {
				$scope.positionList = result.data;
			})
			.catch(function (err) {
				console.log(err);
			})
	}
	$scope.search();
	
	$scope.itemList = [{
		id:'city',
		name:'城市'
	},{
		id:'salary',
		name:'薪水'
	},{
		id:'scale',
		name:'公司规模'
	}];
  	$scope.filterObj = {};
  	var tabId = '';
	
	$scope.itemClick = function (id,name) {
		tabId = id;
		$scope.dic = dict[id];
		$scope.visib = true;
	}
	$scope.sClick = function (id,name) {
		if(id){
			angular.forEach($scope.itemList,function (item) {
				if(item.id === tabId){
					item.name = name;
				}
			})
			$scope.filterObj[tabId + 'Id'] = id;
		}else{
			delete $scope.filterObj[tabId + 'Id'];		
			angular.forEach($scope.itemList,function (item) {
				if(item.id === tabId){
					switch(item.id){
						case 'city':
							item.name = "城市";
							break;
						case 'salary':
							item.name = '薪资';
							break;
						case 'scale':
							item.name = '公司规模';
							break;
					}
				}
			}) 
		}
	}
}])
