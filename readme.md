


# lib_ProductTour

This is the product Tour library for Convertigo projects. use this library to include a "product Tour" functionality to your apps. 

## Symbols

The Tour can optionally be translated using weglot services. If you want to enables this, configure this symbol :

```
lib_producttour.weglot_api_key=<weglot api key>
```
You can find the Weglot api key in the weglot dashboard (https://dashboard.weglot.com)

## Setting up
You will have to invoke the SharedAction **SetupTour** in the AppInit Event of your app. This will setup the tour by reading its configuration from a JSON file's path held in the **StepsPath** SharedVarible.

You will also have to add your custom **introjs-custom.css** file in assets to customize the Tour look & feel.

Here is an example of introjs-custom.css :

```
.introjs-tooltip-header {
	color: #2f2f2f;
}

.introjs-tooltiptext {
	color: #2f2f2f;
}
.introjs-bullets {
	color: #2f2f2f;
}
.introjs-progress {
	color: #2f2f2f;
}
.introjs-arrow {
	color: #2f2f2f;
}

.introjs-tooltipbuttons {
	color: #2f2f2f;
}

.introjs-button {
	color: #2f2f2f !important;
}

.introjs-overlay {
	pointer-events: none !important;
}

.introjs-helperLayer {
	pointer-events: none !important;
}

```


## Intro.json file
All the tour information  is held in a intro.json file usually held in assets/intro.json . This files holds the Tour Configuration options you can find in intro.js configuration doc : [https://introjs.com/docs/tour/options] and the Tour Steps.

These are very similar to the intro.js documentation [https://introjs.com/docs/tour/examples/json-config] but holds a slightly different information. Here is an example of intro.js :

```
{
	"showProgress": true,
	"dontShowAgain": true,
	"steps":[
		{
			"title": "My product tour !",
			"class":".class1729873494929",
			"intro": "This is a sample step info1",
			"url": "/path-to-xfirst"
		},
		{
			"title": "My product tour !",
			"class": ".class1729873481009",
			"intro": "This is a sample step info2",
			"url": "/path-to-page1"
		},
		{
			"title": "My product tour !",
			"class": ".class1729873481018",
			"intro": "This is a sample step info3",
			"url": "/path-to-page1"
		}
	]
}
```
## lib_ProductTour additional attributes

The library adds some step attributes to the standard intro.js attributes.

 * **class** 		attribute must contain the .classXXXXXXX of a Convertigo DisplayObject it can also contain a rootSelector::shadowDomSelector if the element is in the shadow dom
 * **url** 			attribute is the Page url where this Item must be activated
 * **hideNext** 		attribute true hides the next button on specific step
 * **hidePrevious** attribute true hides the previous button on specific step
 * **autoNext** 		attribute true automatically triggers next step when user interacts with the target
 
The ProductTour Engine will ensure that Items intended for a given page will not be displayed on other pages.

Also the ProductTour will allow user interaction and handle page change. Each time a page changes, the Tour will select the items that can be displayed on this page. The library also handles dynamically added elements such as modals, alerts and directives.



For more technical informations : [documentation](./project.md)

- [Installation](#installation)
- [Mobile Library](#mobile-library)
    - [Shared Actions](#shared-actions)
        - [SetupTour](#setuptour)


## Installation

1. In your Convertigo Studio click on ![](https://github.com/convertigo/convertigo/blob/develop/eclipse-plugin-studio/icons/studio/project_import.gif?raw=true "Import a project in treeview") to import a project in the treeview
2. In the import wizard

   ![](https://github.com/convertigo/convertigo/blob/develop/eclipse-plugin-studio/tomcat/webapps/convertigo/templates/ftl/project_import_wzd.png?raw=true "Import Project")
   
   paste the text below into the `Project remote URL` field:
   <table>
     <tr><td>Usage</td><td>Click the copy button at the end of the line</td></tr>
     <tr><td>To contribute</td><td>

     ```
     lib_ProductTour=https://github.com/convertigo/c8oprj-product-tour.git:branch=master
     ```
     </td></tr>
     <tr><td>To simply use</td><td>

     ```
     lib_ProductTour=https://github.com/convertigo/c8oprj-product-tour/archive/master.zip
     ```
     </td></tr>
    </table>
3. Click the `Finish` button. This will automatically import the __lib_ProductTour__ project


## Mobile Library

Describes the mobile application global properties

### Shared Actions

#### SetupTour

Setup a product Tour

**variables**

<table>
<tr>
<th>name</th><th>comment</th>
</tr>
<tr>
<td>StepsPath</td><td>Path to a json files  defining all the Steps of your product tour. Please see intro.js configuration for more information about setting up the steps.

</td>
</tr>
</table>



