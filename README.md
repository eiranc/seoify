# seoify
Set urls when scrolling through a pages content

## usage
add the attributes 'data-seoify' & 'data-title' to a dom element.
now scrolling down to those elements will utilise pushState to add the the url hash & page title from the data-seoify/data-title attributes.

## example

```html
	<div data-seoify="new-url-hash" data-title="New page title"></div>

```

## option settings 

```javascript
	options {
		html4Mode: Boolean, 
		proximity:{ 
			near: Integer, 
			far: Integer 
		}
	} 
```