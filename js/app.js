(function(){
    'use strict';

    angular.module('NarrowItDownApp',[])
    .controller('NarrowItDownController',NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems',FoundItemsDirective)
    .constant('ApiBasePath', 'https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json');


    function FoundItemsDirective(){
        var ddo = {
            templateUrl: 'foundItems.html',
            scope: {
                items : '<',
                onRemove: '&'
            },
            controller: NarrowItDownController,
            controllerAs: 'narrow',
            bindToController: true
        };
        return ddo;
    }

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService){
        var narrowControl = this;
        narrowControl.items2 = "this is what"
        

        narrowControl.getItems = function(searchterm){
            var promise =  MenuSearchService.getMatchedMenuItems(searchterm);
            promise.then(function (response) {
                narrowControl.found = response;
                // console.log("we found them ")
              })
              .catch(function (error) {
                console.log(error);
              })
        }

        narrowControl.removeItem = function(index, elements){
            narrowControl.found = MenuSearchService.removeItem(index, elements)
        };
    }


    MenuSearchService.$inject = ['$http', 'ApiBasePath'];
    function MenuSearchService($http,ApiBasePath){
        var menuServ = this;

        menuServ.getMatchedMenuItems = function(searchTerm){
            return $http({
                method: 'GET',
                url: ApiBasePath,
                params: {
                    description: searchTerm
                  }
            }).then(function(result){
                if (searchTerm == ""){
                    return []
                }else{
                    var foundItems = []
                    for (var item in result.data){
                        var entireMenu = result.data[item]
                        var itemsInMenu = entireMenu["menu_items"]
                        itemsInMenu.forEach((menu) =>{
                                if (menu['description'].includes(searchTerm)){
                                    foundItems.push(menu);
                                }
                            })      
                    }
                   
                    return foundItems;
                }
            })
        }
        menuServ.removeItem= function(index,elements){
            elements.splice(index,1);
            return elements;

        };
    } 
})();
