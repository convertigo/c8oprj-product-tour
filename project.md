
# ![](https://github.com/convertigo/convertigo/blob/develop/engine/src/com/twinsoft/convertigo/beans/core/images/project_color_16x16.png?raw=true "Project") lib_ProductTour

This is the product Tour library for Convertigo projects. use this library to include a "product Tour" functionality to your apps. 

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
All the tour information  is held in a intro.json file usually held in assets/intro.js. This files holds the Tour Configuration options you can find in intro.js configuration doc : [https://introjs.com/docs/tour/options] and the Tour Steps.

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
 * **class** attribute must contain the .classXXXXXXX of a Convertigo DisplayObject 
 * **url** attribute is the Page url where this Item must be activated
 
The ProductTour Engine will ensure that Items intended for a given page will not be displayed on other pages.

Also the ProductTour will allow user interaction and handle page change. Each time a page changes, the Tour will select the items that can be displayed on this page.

<details><summary><span style="color:DarkGoldenRod"><i>Connectors</i></span></summary><blockquote><p>


## ![](https://github.com/convertigo/convertigo/blob/develop/engine/src/com/twinsoft/convertigo/beans/connectors/images/sqlconnector_color_16x16.png?raw=true "SqlConnector") void

void connector, replace or don't use it

<details><summary><span style="color:DarkGoldenRod"><i>Transactions</i></span></summary><blockquote><p>


### ![](https://github.com/convertigo/convertigo/blob/develop/engine/src/com/twinsoft/convertigo/beans/transactions/images/sqltransaction_color_16x16.png?raw=true "SqlTransaction") void

does nothing
</p></blockquote></details>
</p></blockquote></details>

<details><summary><span style="color:DarkGoldenRod"><i>Mobile Application</i></span></summary><blockquote><p>


## ![](https://github.com/convertigo/convertigo/blob/develop/engine/src/com/twinsoft/convertigo/beans/core/images/mobileapplication_color_16x16.png?raw=true "MobileApplication") Application

Describes the mobile application global properties

<details><summary><span style="color:DarkGoldenRod"><i>Pages</i></span></summary><blockquote><p>


<details><summary><b>Page</b> : My First Page as root page</summary><blockquote><p>


### ![](https://github.com/convertigo/convertigo/blob/develop/engine/src/com/twinsoft/convertigo/beans/ngx/components/images/pagecomponent_color_16x16.png?raw=true "PageComponent") Page

My First Page as root page
</p></blockquote></details>

<details><summary><b>Page1</b></summary><blockquote><p>


### ![](https://github.com/convertigo/convertigo/blob/develop/engine/src/com/twinsoft/convertigo/beans/ngx/components/images/pagecomponent_color_16x16.png?raw=true "PageComponent") Page1


</p></blockquote></details>
</p></blockquote></details>

<details><summary><span style="color:DarkGoldenRod"><i>Shared Actions</i></span></summary><blockquote><p>


### ![](https://github.com/convertigo/convertigo/blob/develop/engine/src/com/twinsoft/convertigo/beans/ngx/components/images/uiactionstack_color_16x16.png?raw=true "UIActionStack") SetupTour

Setup a product Tour

<span style="color:DarkGoldenRod">Variables</span>

<table>
<tr>
<th>
name
</th>
<th>
comment
</th>
</tr>
<tr>
<td>
<img src="https://github.com/convertigo/convertigo/blob/develop/engine/src/com/twinsoft/convertigo/beans/ngx/components/images/uistackvariable_16x16.png?raw=true "  alt="UIStackVariable" >&nbsp;StepsPath
</td>
<td>
Path to a json files  defining all the Steps of your product tour. Please see intro.js configuration for more information about setting up the steps.


</td>
</tr>
</table>

</p></blockquote></details>
</p></blockquote></details>
