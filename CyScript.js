console.log("Loaded CyScript");

var CyScript = (intialExport = {}) =>
{
	let csPrivateExports = {
		get: (obj, prop) =>
		{
			if (typeof obj[prop] === 'object' && obj[prop] !== null)
			{
				return new Proxy(obj[prop], csPrivateExports)
			}
			return obj[prop];
		},
		set: (obj, prop, value) =>
		{
			obj[prop] = value;
			
			CyScript.render(document);

			return obj[prop];
		}
	};

	return {
		exports: new Proxy(intialExport, csPrivateExports),

		render: (doc = document, getIncludes = true) =>
		{
			// Get all elements that utilise CyScript value binding
			var relevantEls = doc.querySelectorAll("[cs-bind]");

			for(var i = 0; i < relevantEls.length; i++)
			{
				var element = relevantEls[i];
				if(element.nodeName === "INPUT")
				{
					element.value = eval("CyScript.exports." + element.getAttribute("cs-bind"));
				}
				else
				{
					element.innerHTML = eval("CyScript.exports." + element.getAttribute("cs-bind"));
				}
			};

			if(getIncludes)
			{
				// Get all elements that utilise CyScript external includes (by literal url)
				var relevantEls = doc.querySelectorAll("include[cs-url-lit]");
	
				for(var i = 0; i < relevantEls.length; i++)
				{
					var element = relevantEls[i];
					// Send a request to get the included file
					var request = new XMLHttpRequest();
					request.open("GET", element.getAttribute("cs-url-lit"));
					request.onreadystatechange = function ()
					{
						if(request.readyState === 4 && request.status === 200)
						{
							// Once we have the included file include it
							element.innerHTML = request.responseText;
							CyScript.render(document, false);
						}
					}
					request.send();
				};

				// Get all elements that utilise CyScript external includes
				var relevantEls = doc.querySelectorAll("include[cs-url-var]");
	
				relevantEls.forEach((element) =>
				{
					// Send a request to get the included file
					var request = new XMLHttpRequest();
					request.open("GET", eval("CyScript.exports." + element.getAttribute("cs-url-var")));
					request.onreadystatechange = function ()
					{
						if(request.readyState === 4 && request.status === 200)
						{
							// Once we have the included file include it
							element.innerHTML = request.responseText;
							CyScript.render(document, false);
						}
					}
					request.send();
				});
			}

			// Get all elements that utilise CyScript for each
			var relevantEls = doc.querySelectorAll("[cs-for]");

			relevantEls.forEach((element) =>
			{
				var extract = element.getAttribute("cs-for").split(" in ");
				
				if(extract.length != 2)
				{
					console.warn("CyScript: Invalid for each value in element: ", element);
				}
				else
				{
					var list = eval("CyScript.exports." + extract[1]);
					var originalHTML = element.innerHTML;
					for(var i = 0; i < list.length; i++)
					{
						newdoc = new DOMParser().parseFromString(originalHTML, "text/xml");
						CyScript.render(newdoc);
						element.innerHTML = element.innerHTML + originalHTML;
					}
					element.innerHTML.repeat(eval("CyScript.exports." + extract[1]).length);
					eval("CyScript.exports." + element.getAttribute("cs-bind"));
				}
			});
		}
	};
}
