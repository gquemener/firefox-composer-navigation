console.log('running...');
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
            if (content.includes('require') || content.includes('replace')) {
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
                    repository: null,
                    description: null
                });
            }
        }

        return dependencies;
    };

    var resolveUrl = function(dependency) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                {contentScriptQuery: 'queryPackage', name: dependency.name},
                null,
                function(results) {
                    for (let result of results) {
                        if (result.name === dependency.name) {
                            dependency.description = result.description;
                            if (true === result.virtual) {
                                dependency.repository = result.url;
                                break;
                            }
                            dependency.repository = result.repository;
                            break;
                        }
                    }

                    resolve(dependency);
                }
            );
        });
    };

    var injectLink = function(dependency) {
        console.log(dependency);
        if (null === dependency.repository) {
            return;
        }

        // Sanitize remotely fetched value before injecting it into the DOM
        const tempNode = document.createElement('div');
        tempNode.textContent = dependency.repository;
        const repository = tempNode.innerHTML;

        dependency.node.innerHTML = dependency.node.innerHTML.replace(
            dependency.name,
            `<a href="${repository}" title="${dependency.description}">${dependency.name}</a>`
        );
    };

    for (let dep of extractDependencies()) {
        resolveUrl(dep)
            .then(injectLink)
            .catch(console.log)
        ;
    }
})();
