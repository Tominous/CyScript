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
			
			CyScript.render();

			return obj[prop];
		}
	};

	return {
		exports: new Proxy(intialExport, csPrivateExports),

		render: (getIncludes = true) =>
		{
			// Get all elements that utilise CyScript value binding
			var relevantEls = document.querySelectorAll("[cs-bind]");

			relevantEls.forEach((element) =>
			{
				if(element.nodeName === "INPUT")
				{
					element.value = eval("CyScript.exports." + element.getAttribute("cs-bind"));
				}
				else
				{
					element.innerText = eval("CyScript.exports." + element.getAttribute("cs-bind"));
				}
			});

			if(getIncludes)
			{
				// Get all elements that utilise CyScript external includes
				var relevantEls = document.querySelectorAll("include[cs-url]");
	
				relevantEls.forEach((element) =>
				{
					// Send a request to get the included file
					var request = new XMLHttpRequest();
					request.open("GET", element.getAttribute("cs-url"));
					request.onreadystatechange = function ()
					{
						if(request.readyState === 4 && request.status === 200)
						{
							// Once we have the included file include it
							element.innerHTML = request.responseText;
							CyScript.render(false);
						}
					}
					request.send();
				});
			}
		}
	};
}