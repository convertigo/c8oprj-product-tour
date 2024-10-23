


# lib_ProductTour

This is the product Tour library for Convertigo projects. use this labrary to include a "product Tour" functionnality to your app. 


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
<td>Steps</td><td>Setps holds an array of all the Steps of your product tour</td>
</tr>
</table>



