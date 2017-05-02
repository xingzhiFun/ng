angular.module("app").controller("mainCtrl",["$http","$scope",function ($http,$scope) {
	$http.get("./data/positionList.json")
		.then(function (result) {
			$scope.list = result.data;
		})
		.catch(function (result){
			console.log(result);
		});
//	$scope.list = [
//		{
//			id:'1',
//			name:'测试1',
//			companyName:'爱基金',
//			logoSrc:'images/company-1.jpg',
//			city:'杭州',
//			industry:'核新同花顺',
//			time:'2017-04-28 14:54'
//		},
//		{
//			id:'2',
//			name:'测试2',
//			companyName:'爱基金',
//			logoSrc:'images/company-2.jpg',
//			city:'杭州',
//			industry:'核新同花顺',
//			time:'2017-04-28 14:56'
//		}
//	];
//	$scope.list1 = [
//		{
//			id:'1',
//			name:'测试1',
//			companyName:'爱基金',
//			logoSrc:'images/company-1.jpg',
//			city:'杭州',
//			industry:'核新同花顺',
//			time:'2017-04-28 14:54'
//		},
//		{
//			id:'2',
//			name:'测试2',
//			companyName:'爱基金',
//			logoSrc:'images/company-2.jpg',
//			city:'杭州',
//			industry:'核新同花顺',
//			time:'2017-04-28 14:56'
//		}
//	];
//	$scope.list2 = [
//		{
//			id:'2',
//			name:'测试3',
//			companyName:'爱基金',
//			logoSrc:'images/company-3.jpg',
//			city:'杭州',
//			industry:'核新同花顺',
//			time:'2017-04-28 14:56'
//		}
//	];

}])
