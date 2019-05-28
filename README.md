# CyScript
CyScript is a very lightweight and easy to use JavaScript framework providing dynamic web pages and advanced client side rendering logic.

## About
CyScript is based off of two main principles:

#### Webpages should be able to be dynamically updated without a page refresh/redirect
CyScript provides functionality for this through the cs-bind attribute and the exports class. The cs-bind attribute will bind an element's contents to that of a variable within the exports class. This can also be nested within objects to keep it clean. If a member of the exports class is updated any elements that are bound to it will also be updated with it's new value.

#### Webpages should be object oriented
Object Oriented webpages are ones that are split into multiple files that can be reused in order to improve maintainability and debugging. The problem with this, is that once you have websites that are dynamically updating you start to get into spaghetti code where you are peforming Ajax Requests and getting stuff from the server and then replacing html - CyScript does all of this for you, and has abstracted it down into a single element, the include element. Very similar to the include function in languages such as PHP and C++, the include element takes a parameter "cs-url" and will load the contents of that source as it's contents.

## Installation
CyScript is still under development, and is likely buggy, so you should not be using it in production. Should you wish to test it out, however, simply add `<script src="https://raw.githubusercontent.com/cyruscook/CyScript/master/CyScript.js"></script>` to your page, and then check the [Dynamic Page Example](https://github.com/cyruscook/CyScript/tree/master/dynamicpage) to see how to implement it.

## Usage

#### cs-bind attribute
The cs-bind attribute can be used on elements like so:
```HTML
<title cs-bind="page.title"></title>
```
to bind them to a variable declared like so:
```HTML
<script>
CyScript = CyScript({
  page: {
    title: "Hi"
  }
});

CyScript.render(document);
</script>
```

#### include element
The include element will fill it's contents with the source of the given file. You can provide this file as the value of a give variable like so:
```HTML
<include cs-url-var="page.includeURL"></include>
<script>
CyScript = CyScript({
  page: {
    includeURL: "otherpage.html"
  }
});

CyScript.render(document);
</script>
```
Or as a literal url like so:
```HTML
<include cs-url="otherpage.html"></include>
```
With the advantage of the first example being that the include url can be easily changed simply by using `CyScript.exports.page.includeURL = 'otherotherpage.html';`, and the advantage of the second example being that it is much more compact and has slightly better performance.

#### for-each attribute
The for-each attribute can be used to loop over an array. Best explained by it's usage:
```HTML
<div cs-for="num in inputnums">
  <input type="text" cs-bind="num.number">
</div>
<script>
CyScript = CyScript({
  inputnums: [
    {number: 0},
    {number: 1},
    {number: 2},
    {number: 3}
  ]
});
CyScript.render(document);
</script>
```
