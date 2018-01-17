angular.module('appModule')
.component('discountForm', {
	templateUrl : 'app/appModule/form/discountForm.component.html',
	controllerAs : 'vm',
	controller : function(vetService, $filter, $location, $routeParams, $cookies, $rootScope) {

		var vm = this;
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
		
		var companyExists = false;
		var locationExists = false;
		

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
		
		vm.showNewCompanyForm = function() {
			vm.showCompanyForm = "show";
			vm.companyClick = "hide";
		}
		
		vm.showNewLocationForm = function() {
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
			vetService.getLocations(company.id)
				.then(function(response) {
					vm.locationResults = response.data;
					vm.companyClick = response.data;
				})
			
		}

		//on Location form submit - show Discount form / hide Location form
		vm.addLocation = function(location) {
			vm.showLocation = null;
			vm.showDiscount = location;
			vm.discounts.location = location;
		}
		
		//on Company form submit - show address form / hide company form
		vm.addCompany = function(company) {
			vm.showCompanyForm = null;
			vm.showAddress = company;
			vm.discounts.company = company;
		}

		//on Address form submit - show Location form / hide Company form
		vm.addAddress = function(address) {
			vm.showAddress = null;
			vm.showLocation = address;
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
			if (companyExists) {
				if (locationExists) {
					vetService.createDiscount(vm.discounts.discount, vm.discounts.company.id).then(function() {
						//do something
					});
				}
				else {
					vetService.createAddress(vm.discounts.address).then(function(response) {
						vetService.createLocation(vm.discounts.location, vm.discounts.company.id, response.data.id).then(function(response) {
							vetService.createDiscount(vm.discounts.discount, vm.discounts.company.id).then(function(response) {
								//do something with new discount at new company
								vm.showButton = null;
								reload();
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
								reload();
							})
						})
					})
				})
			}
		}//end of addAllForms method
		

	}
})
