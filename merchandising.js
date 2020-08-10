$(document).ready(

	function(){
	
		//function to get URL vars to use in webservice
		$.extend({
			getUrlVars: function(){
				var vars = [], hash;
				var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
				for(var i = 0; i < hashes.length; i++)
				{
					hash = hashes[i].split('=');
					vars.push(hash[0]);
					vars[hash[0]] = hash[1];
				}
				return vars;
			},
			getUrlVar: function(name){
				return $.getUrlVars()[name];
			}
		});
	
		//Variables for MerchandiseGroups
		var attributeName = $.getUrlVar('AttributeName');
		var attributeValue = $.getUrlVar('AttrtibuteValue');
		var collectionName = '';
	
		//Webservice for collections
		$.ajax({
			type: "POST",
			async: false,
			url: "WebServices/Merchandise/MerchandisingGroups.asmx/GetMerchandiseGroupByValueWithItems",
			data: JSON.stringify({ attributeName: attributeName, attributeValue: attributeValue }),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function (response) {
				var item = response.d;
			
				collectionName = item.Name;
			
				//Prepare html text for CollectionsPageCollage
				var htmltext = "";			
				var groupMembers = item.GroupMembers;
				for (var i = 0; i < groupMembers.length; i++) {
					htmltext = htmltext + "<a href=\"" + groupMembers[i].ItemURL + "\" ><span class=\"CollectionsPageThumbnail\"><img alt=\"" + groupMembers[i].Name + "\" src=\"" + groupMembers[i].Collage1URL + "\" \/><p>" + groupMembers[i].Name + "<br>" + groupMembers[i].ShortDescription + "<\/p><\/span><\/a>";
				}
				$(".CollectionsPageCollage").html(htmltext);			
			
				//Prepare html text for CollectionPageHeader
				htmltext = "<div class=\"CollectionDetails\" >";
				htmltext = htmltext + "<div class=\"CollectionDetailsLeft\" ><h1>The <span>" + item.Name + " <br>Collection<\/span><\/h1>";
				htmltext = htmltext + "<p class=\"CollectionTagline\">" + item.ShortDescription + "<\/p>";
				htmltext = htmltext + "<img class=\"CollectionLeftImage\" alt=\"" + item.Name + "\" src=\"" + item.Photo1URL + "\" \/><\/div>";
				htmltext = htmltext + "<img class=\"CollectionRightImage\" alt=\"" + item.Name + "\" src=\"" + item.Photo2URL + "\" \/>";
				htmltext = htmltext + "<p class=\"CollectionParagraph\">" + item.CollectionFeature + "<\/p>";
				htmltext = htmltext + "<\/div>";
				
				//As webservice have return data, empty div tag (remove laoding image)
				$(".CollectionsPageHeader").empty();
				$(".CollectionsPageHeader").html(htmltext);
			},
			error: function(err) {
				//If webservice have return with error, display it on page
				var htmltext = "<div class=\"CollectionDetails\" ><p>Exception occured: " + err.message + "</p></div>";
				$(".CollectionsPageCollage").html(htmltext);
			}
		});
		
		//Variables for GetAttributeValuesWithFilter
		var itemType = 0; //Leave itemtype=0 if wants to use componenttype=any
		var attributeToDisplayTag = 23; //tag for category (attribute to display on page)
		var attributeToDisplayName = 'Category'; //attribute to display on page.
		var attributeFilterTags = [ 5 ];	//tag for collection
		var attributeFilterNames = [ attributeName ];
		var attributeFilterValues = [ collectionName ];
		
		//Webservice for categories link
		$.ajax({
			type: "POST",
			async: false,
			url: "WebServices/Searching/SearchService.asmx/GetAttributeValuesWithFilter",
			data: JSON.stringify({ itemType: itemType, attributeTag: attributeToDisplayTag, attributeName: attributeToDisplayName, attributeFilterTags: attributeFilterTags, attributeFilterNames: attributeFilterNames, attributeFilterValues: attributeFilterValues }),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function (response) {
				var categories = response;
			
				//Prepare categories links .. 
				var htmltext = "";
				if(categories.length > 0) {
					htmltext = htmltext + "<div class=\"CollectionNavigation\"><ul><li>View " + collectionName + " in:<\/li><li><a href=\"\/ItemBrowser.aspx?action=attributes&ItemType=Furniture&Collection=" + collectionName + "\" >All Categories<\/a><\/li>";
					for(var i = 0; i < categories.length; i++) {
						htmltext = htmltext + "<li><a href=\"\/ItemBrowser.aspx?action=attributes&ItemType=Furniture&Category=" + categories[i] + "&Collection=" + collectionName + "\" >" + categories[i] + "<\/a><\/li>"
					}
					htmltext = htmltext + "<\/ul><\/div>";
				}
				
				$(".CollectionsCategoriesLink").html(htmltext);
			},
			error: function(err) {
				//If webservice have return with error, display it on page
				var htmltext = "<div class=\"CollectionNavigation\" ><p>Exception occured: " + err.message + "</p></div>";
				$(".CollectionsCategoriesLink").html(htmltext);
			}
		});
		
	});
