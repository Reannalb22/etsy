// es5 and 6 polyfills, powered by babel
require("babel/polyfill")

let fetch = require('./fetcher')

var $ = require('jquery'),
	Backbone = require('backbone')

	console.log('loaded dist file')

// var homeURL = 'https://openapi.etsy.com/v2/listings/active.js?api_key=3w2bktapp0baml9j70tm7rca'
// 	detailsURL = 'https://openapi.etsy.com/v2/listings/' + 'uniqueID' + '.js?api_key=3w2bktapp0baml9j70tm7rca'
// 	searchURl = 'https://openapi.etsy.com/v2/listings/active.js?api_key=3w2bktapp0baml9j70tm7rca' + '&keywords='
// 	artistWork = 'https://openapi.etsy.com/v2/shops/' + ':shop_id' + '/listings/active.js?api_key=3w2bktapp0baml9j70tm7rca'


//--------------COLLECTION----------------------
var EtsyCollection = Backbone.Collection.extend({
	
	url: 'https://openapi.etsy.com/v2/listings/active.js?api_key=3w2bktapp0baml9j70tm7rca&callback=?',
		
	parse: function(responseData){
		var startingArray = responseData.results
		return startingArray
	}
}),

ets = new EtsyCollection

ets.fetch().done(function(){
	console.log(ets)
})

.then(function(data){
console.log("and then")
console.log(data)})




//-----------------VIEWS-----------------------


var HomeView = Backbone.View.extend({
	el:"#container",
	
	render: function(){
		console.log(this)
		var	etsyArray = this.collection.models.slice(0,20)

		var htmlString = ""
			etsyArray.forEach((obj)=>{
			htmlString += `<div class="images"><img src= ${obj.attributes.MainImage.url_170x135}></div>`
			})
		
		var title = `<p>Welcome to Etsy</p>`,
			input = `<input type="text" placeholder="Search Etsy!"></input>`

		this.$el.html(title + input + htmlString)
		// this.$el.html(
		// 	`<input type="text" placeholder="Search Etsy!"></input>`
		// 	)
	},
})

// var DetailsView = Backbone.View.extend({
// 	//detail view stuff

// })





// initialize: function(){
// 		this.listenTo(this.model, 'sync', this.render)
// 	}
// }),



//-----------------ROUTER-----------------------
	EtsyRouter = Backbone.Router.extend({
	routes:{
		'*path/:home': showHomeScreen,
		'search/:keywords': showSearch,
		'details/:id': showDetailsScreen
	},

	// showHomeScreen: function(query){
	// 	console.log('showing default')
	// 	this.ec.query = 'sweater' 
	// 	this.ec.fetch({
	// 		processData: true,
	// 		dataType: 'jsonp'
	// 	})
	// },

// 	initialize: function(){
// 		this.ec= new EtsyCollection()
		
// 		this.hv = new HomeView({collection:this.ec})
// 		console.log(ec)
// 	}

// })

var hv = new HomeView({collection: ets})

ets.fetch({
	data:{
		includes: 'MainImage'
	}}).done(hv.render.bind(hv))

