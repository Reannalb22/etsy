// es5 and 6 polyfills, powered by babel
require("babel/polyfill")

let fetch = require('./fetcher')

var $ = require('jquery'),
	Backbone = require('backbone')

	console.log('loaded dist file')


//--------------COLLECTION----------------------
var EtsyCollection = Backbone.Collection.extend({
	
	url: 'https://openapi.etsy.com/v2/listings/active.js',
	apiKey:'3w2bktapp0baml9j70tm7rca',
		
	parse: function(responseData){
		var startingArray = responseData.results
		console.log(responseData)
		return startingArray
	}
})

//------------MODEL(for Details View)-----------
var EtsyModel = Backbone.Model.extend({
	
	url: 'https://openapi.etsy.com/v2/listings',
	apiKey:'3w2bktapp0baml9j70tm7rca',
		
	parse: function(responseData){
		var singleListing = responseData.results[0]
		return singleListing
	}
})

//-----------------VIEWS-----------------------


var HomeView = Backbone.View.extend({
	el:"#container",

	events:{
		"keypress input": "getUserQuery",
		"click img": "getDetailsView"
	},

	getDetailsView: function(event){
		var detailClick = event.target,
		detailId = detailClick.getAttribute("id")
		location.hash = 'details/' + detailId
	},

	getUserQuery: function(event){
		console.log('event triggered')
		if (event.keyCode === 13){
			var inputEl = event.target,
				keywords = inputEl.value
			location.hash = `search/${keywords}`
		}
	},
	
	render: function(){
		console.log(this)
		var	etsyArray = this.collection.models.slice(0,20)

		var htmlString = ""
			etsyArray.forEach((obj)=>{
			htmlString += `<div class="images"><img id="${obj.attributes.listing_id}" src="${obj.attributes.MainImage.url_170x135}"></div>`
			})
		
		var title = `<p id="title">Welcome to Etsy</p>`,
			input = `<input type="text" placeholder="Search Etsy!"></input>`

		this.$el.html(title + input + htmlString)
		$('img').click(this.getDetailsView.bind(this))
	}
})


var DetailsView = Backbone.View.extend({
	el: "#container",

	render: function(){
		// console.log('this is detail view')

		var e = this.model.attributes,
			title = e.title,
			image = e.MainImage.url_570xN,
			price = e.price,
			quantity = e.quantity,
			description = e.description	

		
		console.log(e)

		this.$el.html(`<h1>${title}</h1>
			<div id="singleImage"><img src = ${image}></div>
			<p class="des">$${price} USD, Quantity: ${quantity}</p>
			<p>${description}</p>`)


	}

})



//-----------------ROUTER-----------------------
var EtsyRouter = Backbone.Router.extend({
	
	routes:{
		
		'search/:keywords': 'showSearch',
		'details/:id': 'showDetailsScreen',
		'*anyroute': 'showHomeScreen'
	},

	showHomeScreen: function(){
		console.log('showing default')
		var self = this
		this.ec.fetch({
			data: {
				api_key: this.ec.apiKey,
				includes: 'MainImage'
			},
			processData: true,
			dataType: 'jsonp'
		}).done(function(){
			self.hv.render()
		})
	},

	//above: ajax doing string formatting for us; q is the key; depends on API; when doing a search the value is q. Query is what we are placing into the route


	showSearch: function(keyword){
		console.log('showing whatcha searched for')
		var self = this

		this.ec.fetch({
			data: {
				keywords: keyword,
				api_key: this.ec.apiKey,
				includes: 'MainImage'
			},
			processData: true,
			dataType:'jsonp'
		}).done(function(){
			self.hv.render()})
		},

	showDetailsScreen: function(listing_id){
		console.log('showing your details!')
		var self = this
		
		this.em.fetch({
			url: `${this.em.url}/${listing_id}/.js`,  
			data:{
				api_key: this.em.apiKey,
				includes: 'MainImage'
			},
			processData: true,
			dataType: 'jsonp'
		}).done(function(){
				self.dv.render()})
	},
		

	initialize: function(){
		this.ec = new EtsyCollection
		this.hv = new HomeView({collection:this.ec})
		this.em = new EtsyModel
		this.dv = new DetailsView({model:this.em})
		Backbone.history.start()
	}

})

var newRoute = new EtsyRouter

// var hv = new HomeView({collection: ec})




// var myModel = $.get('url')

// bb.model = {

// 	data:mymodel,

// 	get:function(query){

// 		bb.trigger('d')

// 		return myModel.e.prop
// 	},
// 	set:function(key , val){

// 		bb.trigger('validate' , val)

// 	 	myModel[query] = key
// 	 	return key
// 	} ,

// 	validate:function(userF){

// 		bb.listenTo('validate' , function(val){
// 			userF.call(this , val)
// 		})
		
// 	}


// }
// var e=myModel.prop
// bb.get('e.prop')
// bb.data.prop
// bb.validate(function(phoneNum) {
// 	if(phoneNum.match(/[^0-9]/gi))
// 		return false;
// 	return true;	
// })





