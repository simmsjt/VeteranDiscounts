angular.module('appModule')
.component('discountForm', {
	templateUrl : 'app/appModule/form/discountForm.component.html',
	controllerAs : 'vm',
	controller : function(vetService, $filter, $location, $routeParams, $cookies, $rootScope) {

		var vm = this;
		vm.showLocationList = null;
		vm.showCompanySearch = null;
		vm.showCompanyForm = null;
		vm.companyClick = null;
		vm.showAddress = null;
		vm.showLocation = null;
		vm.showDiscount = null;
		vm.showButton = null;
		vm.companyId = null;
		vm.typeId = null;
		
		vm.company = "";
		vm.companySearchResult = "";
		vm.discounts = {};
		vm.companyResults = [];
		vm.locationResults = [];
		vm.typesArr = [];
		
		vm.companyExists = false;
		vm.locationExists = false;
		

		// Display Updated List
		var reload = function() {
			vetService.index()
			.then(function(res){
				vm.discounts = res.data;
				
				vetService.allTypes()
					.then(function(res) {
						vm.typesArr = res.data;
					})
			})
		}

		reload();
		
		// show Company Form
		vm.showNewCompanyForm = function() {
			vm.showCompanyForm = "show";
			vm.companyClick = "hide";
		}
		
		// show Location Form
		vm.showNewLocationForm = function() {
			vm.showLocationList = null;
			vm.showLocation = "show";
			vm.locationClick = "hide";
		}
		
		//Search for company - 
		vm.searchCompany = function() {
			vetService.searchCompany(vm.company)
				.then(function(response) {
					vm.companyResults = response.data;
//					vm.showCompanySearch = response.data;
				})
		}
		
		// on Company Click - get locations by company id
		vm.getLocations = function(company) {
			console.log(company);
			console.log(company.id);
			vm.discounts.company = company;
			vetService.search(company.name)
				.then(function(response) {
					vm.showLocationList = response.data;
					vm.locationResults = response.data;
					console.log(vm.locationResults);
					vm.companyClick = response.data;
				})
//				vetService.getLocations(company.id)
//				.then(function(response) {
//					vm.showLocationList = response.data;
//					vm.locationResults = response.data;
//					console.log(vm.locationResults);
//					vm.companyClick = response.data;
//				})
			
		}

		//on Company form submit - show address form / hide company form
		vm.addCompany = function(company) {
			vm.showCompanyForm = null;
			vm.showLocation = company;
//			vm.showAddress = company;
			vm.discounts.company = company;
		}
		
		//on Location form submit - show Discount form / hide Location form
		vm.addLocation = function(location) {
			vm.showAddress = location;
			vm.showLocationList = null;
			vm.showLocation = null;
			vm.discounts.location = location;
			console.log(vm.discounts.location);
//			vm.discounts.address = location.address;
//			console.log(vm.discounts.address);
		}

		//on Location form submit - show Discount form / hide Location form
		vm.addLocationFromList = function(location) {
			vm.showAddress = null;
			vm.showLocationList = null;
			vm.showLocation = null;
			vm.showDiscount = location;
			
			vm.discounts.location = location;
			vm.discounts.address = location.address;
			
			console.log(location.id);
			console.log(vm.discounts.location);
			console.log(vm.discounts.address);
		}
		
		//on Address form submit - show Location form / hide Company form
		vm.addAddress = function(address) {
			vm.showDiscount = location;
			vm.showAddress = null;
			vetService.getLatLong(address)
				.then(function(res){
					console.log(res.data);
					address.lat = res.data.results[0].geometry.location.lat;
					address.longitude = res.data.results[0].geometry.location.lng;
				})
			vm.discounts.address = address;
		}

		//on Discount form submit - show AddAllButton / hide Discount form
		vm.addDiscount = function(discount) {
			vm.showDiscount = null;
			vm.showButton = discount;
			vm.discounts.discount = discount;
		}

		// Create Discount - All forms
		vm.addAllForms = function() {
			if (vm.companyExists) {
				if (vm.locationExists) {
					vetService.createDiscount(vm.discounts.discount, vm.discounts.location.id).then(function() {
						vm.showButton = null;
						vm.companyExists = false;
						vm.locationExists = false;
					});
				}
				else {
					vetService.createAddress(vm.discounts.address).then(function(response) {
						vetService.createLocation(vm.discounts.location, vm.discounts.company.id, response.data.id).then(function(response) {
							vetService.createDiscount(vm.discounts.discount, response.data.id).then(function(response) {
								//do something with new discount at new company
								vm.showButton = null;
								reload();
								vm.companyExists = false;
							})
						})
					})
				}
			}
			else {
				vetService.createCompany(vm.discounts.company, vm.typeId).then(function(response) {
					vm.companyId = response.data.id;
					vetService.createAddress(vm.discounts.address).then(function(response) {
						vetService.createLocation(vm.discounts.location, vm.companyId, response.data.id).then(function(response) {
							vetService.createDiscount(vm.discounts.discount, response.data.id).then(function(response) {
								//do something with new discount at new company
								vm.showButton = null;
							})
						})
					})
				})
			}
			$location.path('/');
		}//end of addAllForms method
		

	}
})
