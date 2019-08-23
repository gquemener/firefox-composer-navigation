(function() {
    if (-1 === window.location.href.indexOf('composer.json')) {
        return;
    }

    const extractDependencies = function() {
        const nodes = document.querySelectorAll('.js-file-line');
        let inDependencyBlock = false;
        let dependencies = [];
        for (let node of nodes) {
            const content = node.textContent;
            if (content.includes('require')) {
                inDependencyBlock = true;
                continue;
            }
            if (content.includes('}')) {
                inDependencyBlock = false;
                continue;
            }

            if (inDependencyBlock) {
                dependencies.push({
                    node: node,
                    name: /"([^"]*)"/.exec(content)[1],
                    repository: null
                });
            }
        }

        return dependencies;
    };

    var resolveUrl = function(dependency) {
        const promise = fetch(new Request('https://packagist.org/search.json?q=' + dependency.name, {
            method: 'GET'
        }));

        return promise
            .then(response => response.json())
            .then(json => {
                for (let result of json.results) {
                    if (true === result.virtual) {
                        dependency.repository = result.url;
                        break;
                    }
                    if (result.name === dependency.name) {
                        dependency.repository = result.repository;
                        break;
                    }
                }

                return dependency;
            })
        ;
    };

    var injectLink = function(dependency) {
        if (null === dependency.repository) {
            return;
        }

        // Sanitize remotely fetched value before injecting it into the DOM
        const tempNode = document.createElement('div');
        tempNode.textContent = dependency.repository;
        const repository = tempNode.innerHTML;

        dependency.node.innerHTML = dependency.node.innerHTML.replace(
            dependency.name,
            `<a href="${repository}">${dependency.name}</a>`
        );
    };

    for (let dep of extractDependencies()) {
        resolveUrl(dep)
            .then(injectLink)
            .catch(console.log)
        ;
    }
})();
