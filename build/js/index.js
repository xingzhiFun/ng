'use strict';

angular.module("app",["ui.router","ngCookies","validation"]);

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
//ROUTER
angular.module('app').config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$stateProvider.state('main', {
		url: '/main',
		templateUrl: 'view/main.html',
		controller:'mainCtrl'
	}).state('position',{
		url:'/position/:id',
		templateUrl:'view/position.html',
		controller:'positionCtrl'
	}).state('company',{
		url:'/company/:id',
		templateUrl:'view/company.html',
		controller:'companyCtrl'
	}).state('search',{
		url:'/search',
		templateUrl:'view/search.html',
		controller:'searchCtrl'
	}).state('login',{
		url:'/login',
		templateUrl:'view/login.html',
		controller:'loginCtrl'
	}).state('register',{
		url:'/register',
		templateUrl:'view/register.html',
		controller:'registerCtrl'
	}).state('me',{
		url:'/me',
		templateUrl:'view/me.html',
		controller:'meCtrl'
	}).state('favorite',{
		url:'/favorite',
		templateUrl:'view/favorite.html',
		controller:'favoriteCtrl'
	}).state('post',{
		url:'/post',
		templateUrl:'view/post.html',
		controller:'postCtrl'
	});
	//默认访问地址
	$urlRouterProvider.otherwise('main');
}])
//validation
angular.module("app").config(["$validationProvider", function ($validationProvider) {
	var expression = {
		phone:/^1[\d]{10}$/,
		password: function (value) {
			var str = value + '';
        	return str.length > 5;
		},
		required: function (value) {
			return !!value;
		} 
	};
	var defaultMsg = {
		phone:{
			success: '',
			error: '必须是11位数字的手机号'
		},
		password:{
			success:'',
			error:'长度至少为6位'
		},
		required:{
			success:'',
			error:'不能为空'
		}
	};
	$validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
}])

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

angular.module("app").controller("favoriteCtrl",["$http","$scope",function ($http,$scope) {
	$http.get("data/myFavorite.json")
		.then(function (resp) {
			$scope.favoriteList = resp.data;
		})
}])

angular.module("app").controller("loginCtrl",["$http","$state","cache","$scope",function ($http,$state,cache,$scope) {
	$scope.submit = function () {
		$http.post("data/login.json",$scope.user)
			.then(function (res) {
				cache.put('login.id',res.data.id);
				cache.put('login.name',res.data.name);
				cache.put('login.image',res.data.image);
				$state.go('main');
			})
	}
}])

angular.module("app").controller("mainCtrl",["$http","$scope",function ($http,$scope) {
	$http.get("./data/positionList.json")
		.then(function (result) {
			$scope.list = result.data;
		})
		.catch(function (result){
			console.log(result);
		});
}])

angular.module("app").controller("meCtrl",["cache","$state","$scope",function (cache,$state,$scope) {
	if(cache.get('login.name')){
		$scope.name = cache.get('login.name');
		$scope.imgPath = cache.get('login.image');
	}else{
		// $state.go('login');
	}

	$scope.logout = function () {
		cache.remove('login.id');
		cache.remove('login.image');
		cache.remove('login.name');
		$state.go('main');
	}
}])

angular.module("app").controller("positionCtrl",["$q","$http","$state","cache","$scope",function ($q,$http,$state,cache,$scope) {
	$scope.isLogin = cache.get("login.name") || "";
	$scope.message = $scope.isLogin ? '投个简历' : '登陆';
	function getPosition () {
		var def = $q.defer();
		$http.get('data/position.json?id=' + $state.params.id)
			.then(function (result) {
				$scope.position = result.data;
				
				if(result.data.posted){
					$scope.message = "已投递";
				}

				def.resolve(result.data);
			})
			.catch(function (err) {
				def.reject(err);
			})
		return def.promise;
	}
	
	function getCompany (id) {
		$http.get('data/company.json?id=' + id)
			.then(function (result) {
				$scope.company = result.data;
			})
			.catch(function (err) {
				console.log(err);
			})
	}
	getPosition().then(function (obj) {
		getCompany(obj.companyId);
	})


	$scope.go = function () {
		if($scope.message !== "已投递"){
			if($scope.isLogin){//已经登录
				//点击投个简历，发请求到后台
				$scope.message = "已投递";
			}else{
				$state.go("login");
			}
		}
	}
}])

angular.module("app").controller("postCtrl",["$http","$scope",function ($http,$scope) {
	$scope.itemList = [{
		id:'all',
		name:'全部'
	},{
		id:'pass',
		name:'面试邀请'
	},{
		id:'fail',
		name:'不合适'
	}];

	$http.get("data/myPost.json").then(function (resp) {
		$scope.list = resp.data;
	})

  	$scope.filterObj = {};
  	$scope.itemClick = function (id,name){
  		switch(id){
  			case 'all':
  				delete $scope.filterObj.state;
  				break;
  			case 'pass':
  				$scope.filterObj.state = '1';
  				break;
  			case 'fail':
  				$scope.filterObj.state = '-1';
  				break;
  		}
  	}
}])

angular.module("app").controller("registerCtrl",["$http","$interval","$state","$scope",function ($http,$interval,$state,$scope) {
	$scope.submit = function () { //提交注册
		//http.js重写内置服务$http，模拟post请求拿到返回值
		$http.post('data/regist.json',$scope.user)
		.then(function (res) {
			alert("注册成功，无后台，请使用默认账号登录");
			$state.go('login');
		})
	}

	$scope.send = function () {//获取验证码
		var count = 60;
		$http.get('data/code.json')
			.then(function (result) {
				$scope.time = '60s';
				if(result.status == 200){
					var interval = $interval(function () {
						if(count <= 0){
							$interval.cancel(interval);
							$scope.time = "";
							return;
						}
						count--;
						$scope.time = count + 's';
					},1000)
				}
			})
	}
}])

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

/* **************************************
 *                Directive
 ****************************************/
angular.module("app").directive("appCompany",[function () {
	return {
		restrict:'A',
		replace:true,
		templateUrl:'view/template/company.html',
		scope:{
			comp:'='
		}
	}
}])

angular.module("app").directive("appFoot",["cache","$state",function (cache,$state) {
	return {
		restrict:'A',
		replace:true,
		templateUrl:'view/template/foot.html'
	}
}])

angular.module("app").directive("appHead",["cache",function (cache) {
	return {
		restrict:'A',
		replace:true,
		templateUrl:'view/template/head.html',
		link:function ($scope) {
			$scope.name = cache.get("login.name") || "";
		}
	}
}])

angular.module("app").directive("appHeadBar",[function () {
	return {
		restrict:'A',
		replace:true,
		templateUrl:'view/template/headBar.html',
		scope:{
			title:'@'//传字符串的不用 '=' ，用 '@' 
		},
		link:function ($scope) {
			$scope.back = function () {
				window.history.back();
			}
		}
	}
}])

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

angular.module("app").directive("appSheet",function () {
	return {
		restrict:'A',
		replace:true,
		templateUrl:'view/template/sheet.html',
		scope:{
			list:'=',
			visible:'=',
			slc:'&'
		}
	}
})

angular.module("app").directive("appTab",function () {
	return {
		restrict:'A',
		replace:true,
		templateUrl:'view/template/tab.html',
		scope:{
			list:'=',
			xcli:'&'
		},
		link:function ($scope) {
			$scope.selectId = "city";
			$scope.click = function (item) {
				$scope.selectId = item.id;
				$scope.xcli(item);
			}
		}
	}
})

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

//service
angular.module("app").service("cache",["$cookies",function ($cookies) {
	this.put = function (key,value) {
		$cookies.put(key,value);
	};
	this.get = function (key) {
		return $cookies.get(key);
	};
	this.remove = function (key) {
		$cookies.remove(key);
	}
	
}])