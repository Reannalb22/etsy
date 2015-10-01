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

	events:{
		"keypress input": "getUserQuery",
		"click .images": "getDetailsView"
	},
	
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
	},

	getUserQuery: function(event){
		console.log('event triggered')
		if (event.keyCode === 13){
			var inputEl = event.target,
				keywords = inputEl.value
			location.hash = `search/${keywords}`
		}
	}

// 	getDetailsView: function() {
// 		var imgEl = event.target,
// 			id = imgEl.value
// 		location.hash = `details/${id}`
// 	}
// })

// var DetailsView = Backbone.View.extend({
// 	el: "#container",

// 	getProductInfo: function(product){
// 		var htmlString_details = `
// 		<div id='details view'>
// 				<p> Title: ${product.attributes.title}</p>
// 				<p> Description: ${product.attributes.description}</p>
// 				<img src= ${product.attributes.MainImage.url_170x135}>

// 		</div>`
// 		return htmlString_details
// 	},
	


// 	render: function(){
// 		console.log('pulling up details view')
		
// 		var etsyArray = this.collection.models
// 		var htmlString = ""
// 			etsyArray.forEach((obj)=>{
// 				htmlString += this.getProductInfo(obj)
// 			})
// 	}

})





// initialize: function(){
// 		this.listenTo(this.model, 'update', this.render)
// 	}
// })



//-----------------ROUTER-----------------------
var EtsyRouter = Backbone.Router.extend({
	routes:{
		
		'search/:keywords': 'showSearch',
		'*anyroute/:home': 'showHomeScreen'
		// 'details/:id': 'showDetailsScreen'
	},

	showHomeScreen: function(){
		console.log('showing default')
		this.ets.fetch({
			processData: true
		})
	},

	showSearch: function(keywords){
		console.log('showing whatcha searched for')
		this.ets.category_path[0] = keywords
		this.ets.fetch({
			processData:true
		})
	},

	showDetailsScreen: function(id){
		console.log('showing your details!')
	},

	initialize: function(){
		this.ets = new EtsyCollection()
		this.hv = new HomeView({collection:this.ec})
		Backbone.history.start()
	}

})

var hv = new HomeView({collection: ets})

ets.fetch({
	data:{
		includes: 'MainImage'
	}}).done(hv.render.bind(hv))

